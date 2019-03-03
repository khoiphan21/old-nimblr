import { TestBed } from '@angular/core/testing';

import { BlockQueryService } from './block-query.service';
import { take } from 'rxjs/operators';
import { TextBlock, Block } from '../../classes/block';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { UpdateTextBlockInput, CreateTextBlockInput, BlockType } from '../../../API';
import { updateTextBlock, createTextBlock, deleteBlock } from '../../../graphql/mutations';
import { onUpdateBlockInDocument } from '../../../graphql/subscriptions';
import { environment } from '../../../environments/environment';

const uuidv4 = require('uuid/v4');

export const TEST_TEXT_BLOCK_ID = '03dda84a-7d78-4272-97cc-fe0601075e30';

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
        const blockSubscription = service.getBlock$(TEST_TEXT_BLOCK_ID).subscribe(value => {
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
                updatedOnce = true;
                createUpdate();
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
          function createUpdate() {
            // Create an update with a new version
            input.version = uuidv4();
            input.updatedAt = new Date().toISOString();
            // Store that version into myVersions
            service.registerUpdateVersion(input.version);
            // send the update
            setTimeout(() => {
              graphql.query(updateTextBlock, { input }).then(() => {
                console.log('textblock updated');
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
    it('should return observables for all blocks when queried', done => {
      // First create two blocks
      const graphqlService: GraphQLService = TestBed.get(GraphQLService);
      const documentId = uuidv4();
      const responses = [];
      const input: CreateTextBlockInput = {
        version: uuidv4(),
        type: BlockType.TEXT,
        documentId,
        lastUpdatedBy: uuidv4(),
        value: '(from getBlocksForDocument test)'
      };
      service$.subscribe(service => {
        if (service === null) { return; }
        graphqlService.query(createTextBlock, { input }).then(response => {
          responses.push(response);
          return graphqlService.query(createTextBlock, { input });
        }).then(response => {
          responses.push(response);
          // Get all blocks for the given document id here
          return service.getBlocksForDocument(documentId);
        }).then((observables: Array<Observable<Block>>) => {
          expect(observables.length).toEqual(2);
          observables.forEach(observable => {
            expect(observable instanceof BehaviorSubject).toBe(true);
            observable.subscribe(block => {
              if (block === null) { return; }
              console.log(block);
            });
          });
          // Now delete the two blocks
          return Promise.all(responses.map(response => {
            return graphqlService.query(deleteBlock, {
              input: {
                id: response.data.createTextBlock.id
              }
            });
          }));
        }).then(deletedBlocks => {
          expect(deletedBlocks.length).toEqual(2); // The number of created blocks
          fail();
        }).catch(error => { console.error(error); fail('error received'); done(); });
      }, error => {
        fail('Error getting BlockQueryService from observable');
        console.error(error); done();
      });

    });
  });
});
