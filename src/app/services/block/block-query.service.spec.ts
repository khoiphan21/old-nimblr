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
import { BlockFactoryService } from './block-factory.service';
import { processTestError } from '../../classes/helpers';

const uuidv4 = require('uuid/v4');

export class MockBlockQueryService {
  getBlock$(_: string) { return new Subject(); }
  getBlocksForDocument(_: string) { return new Promise((___, __) => {}); }
  registerUpdateVersion(_: string) {}
  subscribeToUpdate(_: string) { return new Promise((___, __) => {}); }
  registerBlockCreatedByUI(_: Block) { }
}

class TextBlockQueryHelper {

  private createdBlockIds: Array<string> = [];

  constructor(private graphQlService: GraphQLService) {
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
  let graphQlService: GraphQLService;
  let blockFactory: BlockFactoryService;
  let helper: TextBlockQueryHelper;
  TestBed.configureTestingModule({});

  function getService(): Promise<BlockQueryService> {
    return new Promise((resolve, reject) => {
      Auth.signIn(TEST_USERNAME, TEST_PASSWORD).then(() => {
        service$.subscribe(service => {
          if (service === null) { return; }
          resolve(service);
        }, error => reject(error));
      }).catch(error => console.error(error));
    });
  }

  beforeAll(() => {
    Auth.signIn(TEST_USERNAME, TEST_PASSWORD).then(() => {
      service$.next(TestBed.get(BlockQueryService));
    });
  });

  beforeEach(() => {
    blockFactory = TestBed.get(BlockFactoryService);
    graphQlService = TestBed.get(GraphQLService);
    helper = new TextBlockQueryHelper(graphQlService);
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
      const documentId = uuidv4();
      let createdBlock;
      // Create a block
      helper.createBlocks({
        amount: 1,
        documentId,
        value: '(from getBlock$ test)'
      }).catch(error => {
        console.error(error);
        return Promise.reject('unable to create blocks');
      }).then(blocks => {
        createdBlock = blocks[0].data.createTextBlock;
        return getService();
      }).then(service => {
        return getFirstBlock(service, createdBlock.id);
      }).catch(error => {
        console.error(error);
        return Promise.reject('unable to retrieve blocks');
      }).then(retrievedBlock => {
        checkTextBlock(retrievedBlock, createdBlock);
        return helper.deleteCreatedBlocks();
      }).then(() => done()
      ).catch(error => processTestError('fail to create blocks', error, done));
    });

    function getFirstBlock(service: BlockQueryService, blockId: string): Promise<Block> {
      return new Promise((resolve, reject) => {
        service.getBlock$(blockId).subscribe(block => {
          if (block !== null) { resolve(block); }
        }, error => reject(error));
      });
    }

    function checkTextBlock(retrievedBlock, createdBlock) {
      expect(retrievedBlock.id).toEqual(createdBlock.id);
      expect(retrievedBlock.version).toEqual(createdBlock.version);
      expect(retrievedBlock.documentId).toEqual(createdBlock.documentId);
    }

    it('should store the retrieved block in the internal map', done => {
      const documentId = uuidv4();
      let createdBlock;
      let service: BlockQueryService;
      helper.createBlocks({
        amount: 1,
        documentId
      }).then(responses => {
        createdBlock = responses[0].data.createTextBlock;
        return getService();
      }).then(retrievedService => {
        service = retrievedService;
        return getFirstBlock(service, createdBlock.id);
      }).then(() => {
        /* tslint:disable:no-string-literal */
        const observable = service['blocksMap'].get(createdBlock.id);
        expect(observable.subscribe).toBeTruthy(); // Make sure it's an observable
        observable.subscribe(block => {
          if (block === null) { return; }
          checkTextBlock(block, createdBlock);
          done();
        });
        return helper.deleteCreatedBlocks();
      }).then(() => done()
      ).catch(error => processTestError('error testing blocksMap', error, done));
    });

    it('should not call backend again if it already called once', done => {
      const documentId = uuidv4();
      let createdBlock;
      let service: BlockQueryService;
      helper.createBlocks({
        amount: 1,
        documentId
      }).then(responses => {
        createdBlock = responses[0].data.createTextBlock;
        return getService();
      }).then(retrievedService => {
        service = retrievedService;
        return getFirstBlock(service, createdBlock.id);
      }).then(() => {
        /* tslint:disable:no-string-literal */
        // Spy on the query method of the graphQlService
        const spy = spyOn(service['graphQlService'], 'query').and.returnValue(Promise.resolve());
        // Check return value
        service.getBlock$(createdBlock.id).pipe(take(1)).subscribe(block => {
          // Check relevant values
          checkTextBlock(block, createdBlock);
          // Check that the query method should not have been called
          expect(spy.calls.count()).toEqual(0);
          done();
        });
      }).catch(error => processTestError('error in test not call backend', error, done));
    });

    it('should notify when there is an update on a block', done => {
      const documentId = uuidv4();
      let createdBlock;
      let service: BlockQueryService;
      helper.createBlocks({
        amount: 1,
        documentId
      }).then(responses => {
        createdBlock = responses[0].data.createTextBlock;
        return getService();
      }).then(service => {
        if (service === null) { return; }
        let shouldUpdate = true;
        const input: UpdateTextBlockInput = {
          id: createdBlock.id,
          version: uuidv4(),
          lastUpdatedBy: uuidv4(),
          updatedAt: new Date().toISOString(),
          value: '(block for testing) new value: ' + Math.random()
        };
        service.getBlock$(createdBlock.id).subscribe(block => {
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
        }, () => console.error('unable to get block with given id'));
      }).catch(error => processTestError('Error in testing update for block', error, done));
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

        const helper = new TextBlockQueryHelper(graphQlService);

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
        const helper = new TextBlockQueryHelper(graphQlService);

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

        const helper = new TextBlockQueryHelper(TestBed.get(GraphQLService));

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

  describe('registerBlockCreatedByUI', () => {
    let block: Block;

    function getService(): Promise<BlockQueryService> {
      return new Promise((resolve, reject) => {
        service$.subscribe(service => {
          if (service !== null) {
            resolve(service);
          }
        }, error => reject(error));
      });
    }

    beforeEach(() => {
      block = blockFactory.createAppBlock({
        id: uuidv4(),
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4(),
        version: uuidv4(),
        type: BlockType.TEXT,
        value: ''
      });
    });

    it('should store the block in the internal map', done => {
      getService().then(service => {
        service.registerBlockCreatedByUI(block);
        service.getBlock$(block.id).subscribe(storedBlock => {
          if (storedBlock === null) { return; }
          expect(storedBlock.id).toEqual(block.id);
          done();
        }, error => processTestError(
          'registerBlockCreatedByUI test unable to get block', error, done
        ));
      }).catch(error => processTestError('unable to get service', error, done));
    });

    it('should also store the version of the given block', done => {
      getService().then(service => {
        service.registerBlockCreatedByUI(block);
        expect(service['myVersions'].has(block.version)).toBe(true);
        done();
      }, error => processTestError('unable to get service', error, done));
    });
  });
});
