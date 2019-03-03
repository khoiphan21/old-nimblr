import { TestBed } from '@angular/core/testing';

import { BlockQueryService } from './block-query.service';
import { take } from 'rxjs/operators';
import { TextBlock, Block } from '../../classes/block';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { UpdateTextBlockInput, BlockType, CreateTextBlockInput } from '../../../API';
import { updateTextBlock, createTextBlock, deleteBlock } from '../../../graphql/mutations';
import { environment } from '../../../environments/environment';

const uuidv4 = require('uuid/v4');

export const TEST_TEXT_BLOCK_ID = '03dda84a-7d78-4272-97cc-fe0601075e30';


interface QueryHelperInput {
  graphQlService: GraphQLService;
}

class TextBlockQueryHelper {
  private graphQlService: GraphQLService;

  private createdBlockIds: Array<string> = [];

  constructor(input: QueryHelperInput) {
    this.graphQlService = input.graphQlService;
  }

  async createBlocks({
    amount,
    id = null,
    version = uuidv4(),
    type = BlockType.TEXT,
    documentId = uuidv4(),
    lastUpdatedBy = uuidv4(),
    value = 'Block created during test'
  }): Promise<Array<any>> {
    const input: CreateTextBlockInput = {
      id, version, type, documentId, lastUpdatedBy, value
    };
    const promises: Array<Promise<any>> = [];
    try {
      for (let i = 0; i < amount; i++) {
        promises.push(this.graphQlService.query(createTextBlock, { input }));
      }

      const createdBlocks = await Promise.all(promises);

      createdBlocks.forEach(block => {
        this.createdBlockIds.push(block.data.createTextBlock.id);
      });

      return Promise.resolve(createdBlocks);

    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteCreatedBlocks(): Promise<Array<any>> {
    try {
      const deletedBlocks = await Promise.all(this.createdBlockIds.map(id => {
        return this.graphQlService.query(deleteBlock, { input: { id } });
      }));

      // Clear the internal list
      this.createdBlockIds = [];

      return Promise.resolve(deletedBlocks);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

describe('BlockQueryService', () => {
  const service$ = new BehaviorSubject<BlockQueryService>(null);
  TestBed.configureTestingModule({});

  beforeAll(() => {
    Auth.signIn(TEST_USERNAME, TEST_PASSWORD).then(() => {
      service$.next(TestBed.get(BlockQueryService));
    });
  });

  it('should be created', () => {
    const service = TestBed.get(BlockQueryService);
    expect(service).toBeTruthy();
  });

  describe('getBlock$', () => {

    it('should return an observable with initial value null', done => {
      const id = uuidv4();
      service$.subscribe(service => {
        if (service === null) { return; }
        service.getBlock$(id).pipe(take(1)).subscribe(value => {
          expect(value).toBe(null);
          done();
        }, error => { fail(error); done(); });
      }, error => { fail(error); done(); });
    });

    it('should return a valid block if the id is correct', done => {
      const serviceSubscription = service$.subscribe(service => {
        if (service === null) { return; }
        service.getBlock$(TEST_TEXT_BLOCK_ID).subscribe(value => {
          if (value === null) { return; }
          checkTextBlock(value, TEST_TEXT_BLOCK_ID);
          serviceSubscription.unsubscribe();
          done();
        }, error => { fail(error); done(); });
      });
    });

    function checkTextBlock(givenObject, id: string) {
      expect(givenObject instanceof TextBlock).toBe(true); // should be a TextBlock
      expect(givenObject.id).toEqual(id);
    }

    it('should store the retrieved block in the internal map', done => {
      service$.subscribe(service => {
        if (service === null) { return; }
        service.getBlock$(TEST_TEXT_BLOCK_ID).subscribe(value => {
          if (value === null) { return; }
          /* tslint:disable:no-string-literal */
          const observable = service['blocksMap'].get(TEST_TEXT_BLOCK_ID);
          expect(observable.subscribe).toBeTruthy(); // Make sure it's an observable
          observable.subscribe(block => {
            if (block === null) { return; }
            checkTextBlock(block, TEST_TEXT_BLOCK_ID);
            done();
          });
        }, error => { fail(error); done(); });
      });
    }, 10000);

    it('should not call backend again if it already called once', done => {
      service$.subscribe(service => {
        if (service === null) { return; }
        service.getBlock$(TEST_TEXT_BLOCK_ID).pipe(take(1)).subscribe(value => {
          if (value === null) { return; }
          /* tslint:disable:no-string-literal */
          // Spy on the query method of the graphQlService
          const spy = spyOn(service['graphQlService'], 'query').and.returnValue(Promise.resolve());
          // Check return value
          service.getBlock$(TEST_TEXT_BLOCK_ID).pipe(take(1)).subscribe(block => {
            // Check relevant values
            checkTextBlock(block, TEST_TEXT_BLOCK_ID);
            // Check that the query method should not have been called
            expect(spy.calls.count()).toEqual(0);
            done();
          });
        }, error => { fail(error); done(); });
      });
    });

    it('should notify when there is an update on a block', done => {
      service$.subscribe(service => {
        if (service === null) { return; }
        let shouldUpdate = true;
        const input: UpdateTextBlockInput = {
          id: TEST_TEXT_BLOCK_ID,
          version: uuidv4(),
          lastUpdatedBy: uuidv4(),
          updatedAt: new Date().toISOString(),
          value: '(block for testing) new value: ' + Math.random()
        };
        service.getBlock$(TEST_TEXT_BLOCK_ID).subscribe(block => {
          if (block === null) { return; }
          // Setup subscription
          service.subscribeToUpdate(block.documentId);
          if (shouldUpdate) {
            shouldUpdate = false;
            // Call to update the block
            const graphQLService: GraphQLService = TestBed.get(GraphQLService);
            setTimeout(() => {
              graphQLService.query(updateTextBlock, { input }).then(() => {
              }).catch(error => {
                fail(error);
                done();
              });
            }, environment.WAIT_TIME_BEFORE_UPDATE);
          } else {
            // Check if the notified block is the updated block
            expect(block.version).toEqual(input.version);
            expect(block.lastUpdatedBy).toEqual(input.lastUpdatedBy);
            expect(block.updatedAt).toEqual(input.updatedAt);
            done();
          }
        });
      });
    }, environment.TIMEOUT_FOR_UPDATE_TEST);

    it('should not notify if the received version is in myVersions', done => {
      service$.subscribe(service => {
        if (service === null) { return; }
        // First create a block for testing
        const input = {
          id: uuidv4(),
          version: uuidv4(),
          type: BlockType.TEXT,
          documentId: uuidv4(),
          updatedAt: undefined,
          lastUpdatedBy: uuidv4(),
          value: 'TextBlock created from test'
        };
        const graphql: GraphQLService = TestBed.get(GraphQLService);

        // Create the text block
        graphql.query(createTextBlock, { input }).then(() => {
          // Retrieve that block's observable. This one should only be notified of the actual block once
          let count = 1;
          let updatedOnce = false;
          service.getBlock$(input.id).subscribe(block => {
            if (block === null) { return; }

            switch (count) {
              case 1:
                service.subscribeToUpdate(block.documentId);
                updatedOnce = true;
                sendAnUpdateToAPI();
                count++;
                break;
              default:
                fail('should not be called again');
                done();
                break;
            }
          }, error => {
            fail('error getting block');
            console.error(error);
            done();
          });

          // Update the block with the new version
          function sendAnUpdateToAPI() {
            // Create an update with a new version
            input.version = uuidv4();
            input.updatedAt = new Date().toISOString();
            // Store that version into myVersions
            service.registerUpdateVersion(input.version);
            // send the update
            setTimeout(() => {
              graphql.query(updateTextBlock, { input }).then(() => {
                setTimeout(() => {
                  // After time runs out and there's no more update, should call done
                  if (updatedOnce) { done(); }
                }, environment.WAIT_TIME_BEFORE_UPDATE);
              }).catch(error => {
                console.error(error); fail('unable to update'); done();
              });
            }, environment.WAIT_TIME_BEFORE_UPDATE);
          }
        });
      });
    }, 10000);

  });

  describe('getBlocksForDocument', () => {
    it('should return observables for all blocks (with values)', done => {
      const graphQlService: GraphQLService = TestBed.get(GraphQLService);
      const documentId = uuidv4();
      const amountOfBlocks = 2;
      service$.subscribe(service => {
        if (service === null) { return; }

        const helper = new TextBlockQueryHelper({ graphQlService });

        // Start testing logic
        // First create two blocks
        helper.createBlocks({
          amount: amountOfBlocks,
          documentId,
          value: '(from getBlocksForDocument test)'
        }).then(() => {
          // Call the function
          return service.getBlocksForDocument(documentId);
        }).then((observables: Array<Observable<Block>>) => {
          // Check the return observables
          expect(observables.length).toEqual(amountOfBlocks);
          return checkObservables(observables);
        }).then(() => {
          return helper.deleteCreatedBlocks();
        }).then(responses => {
          // Check that the blocks have been deleted
          expect(responses.length).toBe(amountOfBlocks);
          done();
        }).catch(error => { console.error(error); fail('error received'); done(); });
      }, error => {
        fail('Error getting BlockQueryService from observable');
        console.error(error); done();
      });

      async function checkObservables(
        observables: Array<Observable<Block>>
      ): Promise<any> {
        return Promise.all(observables.map(observable => {
          return awaitAndCheckObservable(observable);
        }));
      }

      async function awaitAndCheckObservable(observable: Observable<any>) {
        return new Promise((resolve, reject) => {
          // Write the expect() statements here
          expect(observable instanceof BehaviorSubject).toBe(true);
          observable.subscribe(block => {
            if (block === null) { return; }
            expect(block.documentId).toEqual(documentId);
            resolve();
          }, error => reject(error));
        });
      }
    });

    it('should update blockMaps', done => {
      // First create two blocks
      const graphQlService: GraphQLService = TestBed.get(GraphQLService);
      let createdBlockResponse;
      const amountOfBlocks = 1;
      service$.subscribe(service => {
        if (service === null) { return; }
        const helper = new TextBlockQueryHelper({ graphQlService });

        // Start testing logic
        // First create two blocks
        helper.createBlocks({
          amount: amountOfBlocks,
          value: '(from getBlocksForDocument test)'
        }).then(responses => {
          expect(responses.length).toBe(1);
          createdBlockResponse = responses[0].data.createTextBlock;
          // Retrieve the block
          return service.getBlocksForDocument(createdBlockResponse.documentId);
        }).then(() => {
          // Check the blockMap variable
          service['blocksMap'].get(createdBlockResponse.id).pipe(take(1)).subscribe(block => {
            expect(block instanceof TextBlock).toBe(true);
          });

          // Call the function
          return helper.deleteCreatedBlocks();
        }).then(responses => {
          // Check that the blocks have been deleted
          expect(responses.length).toBe(amountOfBlocks);
          done();
        }).catch(error => { console.error(error); fail('error received'); done(); });
      }, error => {
        fail('Error getting BlockQueryService from observable');
        console.error(error); done();
      });
    });
  });

  describe('TextBlockQueryHelper', () => {
    it('should create and delete blocks as requested', done => {
      service$.subscribe(service => {
        if (service === null) { return; }
        const input = {
          documentId: uuidv4(),
          value: '(from Helper test)'
        };

        const helper = new TextBlockQueryHelper({
          graphQlService: TestBed.get(GraphQLService)
        });

        const ids = new Set();

        // Start testing code here
        helper.createBlocks({
          amount: 2,
          value: input.value,
          documentId: input.documentId
        }).then((responses: Array<any>) => {

          expect(responses.length).toBe(2);
          responses.forEach(response => {
            // Store the ids to test against created blocks later
            ids.add(response.data.createTextBlock.id);
            // Checking these 2 properties should be enough.
            expect(response.data.createTextBlock.documentId).toEqual(input.documentId);
            expect(response.data.createTextBlock.value).toEqual(input.value);
          });

          return helper.deleteCreatedBlocks();
        }).then((responses: Array<any>) => {
          expect(responses.length).toBe(2);
          responses.forEach(response => {
            expect(ids.has(response.data.deleteBlock.id)).toBe(true);
          });
          done();
        }).catch(error => { fail(); console.error(error); done(); });
      });
    });
  });

  describe('subscribeToUpdate', () => {
    it('should not subscribe to backend again if already subscribed', done => {
      const documentId = uuidv4();
      const graphQlService: GraphQLService = TestBed.get(GraphQLService);
      const service: BlockQueryService = TestBed.get(BlockQueryService);
      const spy = spyOn(graphQlService, 'getSubscription').and.returnValue(new Subject());

      service.subscribeToUpdate(documentId).then(() => {
        // Try to subscribe again
        return service.subscribeToUpdate(documentId);
      }).then(() => {
        expect(spy.calls.count()).toBe(1);
        done();
      }).catch(error => { fail('Error received'); console.error(error); done(); });
    });
  });
});
