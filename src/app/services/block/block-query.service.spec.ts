import { TestBed } from '@angular/core/testing';

import { BlockQueryService } from './block-query.service';
import { take, skip } from 'rxjs/operators';
import { TextBlock, Block } from '../../classes/block';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Auth, graphqlOperation } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { UpdateTextBlockInput, BlockType, CreateTextBlockInput } from '../../../API';
import { updateTextBlock, createTextBlock, deleteBlock } from '../../../graphql/mutations';
import { environment } from '../../../environments/environment';
import { BlockFactoryService } from './block-factory.service';
import { processTestError } from '../../classes/helpers';
import { MockAPIDataFactory } from '../graphQL/mockData';
import { getBlock } from '../../../graphql/queries';

const uuidv4 = require('uuid/v4');

export class MockBlockQueryService {
  getBlock$(_: string) { return new Subject(); }
  getBlocksForDocument(_: string) { return new Promise((___, __) => { }); }
  registerUpdateVersion(_: string) { }
  subscribeToUpdate(_: string) { return new Promise((___, __) => { }); }
  registerBlockCreatedByUI(_: Block) { }
}

/**
 * Helper classes and functions for testing
 */

class TextBlockQueryHelper {

  private createdBlockIds: Array<string> = [];
  private service$ = new BehaviorSubject<BlockQueryService>(null);
  private service: BlockQueryService;

  constructor(private graphQlService: GraphQLService) {
  }

  async getService(): Promise<BlockQueryService> {
    return new Promise((resolve, reject) => {
      if (this.service) {
        resolve(this.service);
      } else {
        this.service$.subscribe(service => {
          if (service === null) { return; }

          resolve(service);
        }, error => reject(error));
      }
    });
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

/* tslint:disable:no-string-literal */
fdescribe('(Unit Tests)', () => {
  let service: BlockQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(BlockQueryService);
  });

  describe('getBlock$()', () => {
    let id: string;
    let documentId: string;
    let querySpy: jasmine.Spy;
    let subscriptionSpy: jasmine.Spy;
    let backendSubject: Subject<any>;

    beforeEach(() => {
      documentId = uuidv4();
      id = uuidv4();
      // Setup the query spy
      querySpy = spyOn(service['graphQlService'], 'query');
      querySpy.and.returnValue(Promise.resolve({
        data: {
          getBlock: MockAPIDataFactory.createBlock({
            id, documentId
          })
        }
      }));
      // Setup the subscription spy
      subscriptionSpy = spyOn(service['graphQlService'], 'getSubscription');
      backendSubject = new Subject();
      subscriptionSpy.and.returnValue(backendSubject);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should return an observable with initial value null', done => {
      service.getBlock$(id).pipe(take(1)).subscribe(value => {
        expect(value).toBe(null);
        done();
      }, error => { fail(error); done(); });
    });

    it('should return a valid block for a given id', done => {
      // Call the function from the service to check
      service.getBlock$(id).pipe(skip(1)).pipe(take(1)).subscribe(block => {
        const queryArg = querySpy.calls.mostRecent().args[0];
        expect(queryArg).toEqual(getBlock);
        checkBlock({
          given: block,
          expected: { id },
          attributes: ['id', 'instance'],
          instanceType: TextBlock
        });
        done();
      }, error => processTestError('Error in BlockQueryService', error, done));
    });

    function checkBlock({
      given, expected, attributes = [], instanceType = null
    }) {
      attributes.forEach(attribute => {
        if (attribute === 'instance') {
          expect(given instanceof instanceType).toBe(true);
        } else {
          expect(given[attribute]).toEqual(expected[attribute]);
        }
      });
    }

    it('should store the retrieved block in the internal map', done => {
      service.getBlock$(id).pipe(skip(1)).pipe(take(1)).subscribe(() => {
        const observable = service['blocksMap'].get(id);
        expect(observable.subscribe).toBeTruthy(); // Make sure it's an observable
        // Now when called the observable should return a block first
        observable.pipe(take(1)).subscribe(block => {
          checkBlock({
            given: block,
            expected: { id },
            attributes: ['id', 'instance'],
            instanceType: TextBlock
          });
          done();
        }, error => processTestError('Error in BlockQueryService', error, done));
      }, error => processTestError('Error in BlockQueryService', error, done));
    });

    it('should not call backend again if it already called once', done => {
      service.getBlock$(id).pipe(skip(1)).pipe(take(1)).subscribe(() => {
        // Now when called the observable should return a block first
        service['blocksMap'].get(id).pipe(take(1)).subscribe(() => {
          // Check that the query method should have only been called once
          expect(querySpy.calls.count()).toBe(1);
          done();
        }, error => processTestError('Error in BlockQueryService', error, done));
      }, error => processTestError('Error in BlockQueryService', error, done));
    });

    it('should notify when there is an update on a document', done => {
      // Setup the supposedly 'updated' block
      const input = {
        id, documentId,
        version: uuidv4(),
        lastUpdatedBy: uuidv4(),
        updatedAt: new Date().toISOString(),
        value: '(block for testing) new value: ' + Math.random()
      };
      // generate and remap the factory default basic response
      const response = {
        value: {
          data: {
            onUpdateBlockInDocument: MockAPIDataFactory.createBlock(input)
          }
        }
      };
      // Setup code to test subscription
      service.subscribeToUpdate(documentId);
      service.getBlock$(id).pipe(skip(1)).pipe(take(1)).subscribe(() => {
        // time out is needed to make sure the first notification is received
        setTimeout(() => {
          backendSubject.next(response);
        }, 50);
      });
      service.getBlock$(id).pipe(skip(2)).pipe(take(1)).subscribe(block => {
        // now check if the retrieved block is correct
        checkBlock({
          given: block,
          expected: input,
          attributes: [
            'id', 'instance', 'document', 'version', 'lastUpdatedBy',
            'updatedAt', 'value'
          ],
          instanceType: TextBlock
        });
        done();
      });
    });

    it('should not notify if the received version is in myVersions', done => {
      const version = uuidv4();
      // Setup the supposedly 'updated' block
      const input = {
        id, documentId, version,
        lastUpdatedBy: uuidv4(),
        updatedAt: new Date().toISOString(),
        value: '(block for testing) new value: ' + Math.random()
      };
      // generate and remap the factory default basic response
      const response = {
        value: {
          data: {
            onUpdateBlockInDocument: MockAPIDataFactory.createBlock(input)
          }
        }
      };
      // Setup code to test subscription
      service.subscribeToUpdate(documentId);

      service.getBlock$(id).pipe(skip(1)).pipe(take(1)).subscribe(() => {
        // time out is needed to make sure the first notification is received
        setTimeout(() => {
          // Register a version into the service
          service.registerUpdateVersion(version);
          backendSubject.next(response);
        }, 50);
        // Set time out: if no notification received then automatically passes
        setTimeout(() => {
          done();
        }, 100);
      });
      service.getBlock$(id).pipe(skip(2)).pipe(take(1)).subscribe(() => {
        // should fail if a 3rd notification is received
        fail('should not have notified the 3rd time');
        done();
      });
    });
  });
});

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
