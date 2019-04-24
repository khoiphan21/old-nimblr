import { TestBed } from '@angular/core/testing';

import { BlockQueryService } from './block-query.service';
import { take, skip } from 'rxjs/operators';
import { Block } from '../../../classes/block/block';
import { TextBlock } from '../../../classes/block/textBlock';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { BlockFactoryService } from '../factory/block-factory.service';
import { processTestError } from '../../../classes/test-helpers.spec';
import { MockAPIDataFactory } from '../../graphQL/mockData';
import { getBlock } from '../../../../graphql/queries';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';

const uuidv4 = require('uuid/v4');

/* tslint:disable:no-string-literal */
fdescribe('BlockQueryService', () => {
  let service: BlockQueryService;
  let id: string;
  let documentId: string;
  let mockBlock: any;
  let querySpy: jasmine.Spy;
  let subscriptionSpy: jasmine.Spy;
  let backendSubject: Subject<any>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(BlockQueryService);

    // Setup testing data
    documentId = uuidv4();
    id = uuidv4();
    mockBlock = MockAPIDataFactory.createBlock({ id, documentId });
    // Setup the query spy
    querySpy = spyOn(service['graphQlService'], 'query');
    querySpy.and.returnValue(Promise.resolve({
      data: {
        getBlock: mockBlock
      }
    }));
    // Setup the subscription spy
    subscriptionSpy = spyOn(service['graphQlService'], 'getSubscription');
    backendSubject = new Subject();
    subscriptionSpy.and.returnValue(backendSubject);
  });

  describe('getBlock$()', () => {

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

    it('should notify an error if there is an issue processing raw', done => {
      // Setup the factory spy to throw an error
      const errorMessage = 'test error';
      const factorySpy = spyOn(service['blockFactoryService'], 'createAppBlock');
      factorySpy.and.throwError(errorMessage);
      // now try to get the block
      service.getBlock$(id).subscribe(block => {
        if (block === null) { return; }
        fail('error should have occurred'); done();
      }, error => {
        expect(error.message).toEqual(errorMessage);
        done();
      });
    });
  });

  describe('getBlocksForDocument()', () => {
    let listSpy: jasmine.Spy;

    beforeEach(() => {
      // Setup the 'list' spy
      listSpy = spyOn(service['graphQlService'], 'list');
      listSpy.and.returnValue(Promise.resolve({
        items: [
          MockAPIDataFactory.createBlock({ documentId }),
          MockAPIDataFactory.createBlock({ documentId })
        ]
      }));
    });

    it('should return a list of blocks', done => {
      service.getBlocksForDocument(documentId).then(blocks => {
        expect(blocks.length).toBe(2);
        done();
      }).catch(error => processTestError('ERROR in BlockQueryService', error, done));
    });

    it('should throw an error if graphQlService call fails', done => {
      // Setup the 'list' spy to throw an error
      const errorMessage = 'test error';
      listSpy.and.returnValue(Promise.reject(errorMessage));
      // now try to get blocks for a document
      service.getBlocksForDocument(documentId).then(() => {
        fail('error should have occurred'); done();
      }).catch(error => {
        expect(error).toEqual(errorMessage);
        done();
      });
    });
  });

  describe('getBlocksObservablesForDocument()', () => {
    let listSpy: jasmine.Spy;

    beforeEach(() => {
      // Setup the 'list' spy
      listSpy = spyOn(service['graphQlService'], 'list');
      listSpy.and.returnValue(Promise.resolve({
        items: [
          MockAPIDataFactory.createBlock({ documentId }),
          MockAPIDataFactory.createBlock({ documentId })
        ]
      }));
    });

    it('should return observables with values for all blocks', done => {
      service.getBlocksObservablesForDocument(documentId).then(observables => {
        expect(observables.length).toBe(2);

        return Promise.all(observables.map(observable => {
          return awaitAndCheckObservable(observable);
        })).then(() => done());
      }).catch(error => processTestError('ERROR in BlockQueryService', error, done));
    });

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

    it('should update blockMaps', done => {
      service.getBlocksObservablesForDocument(documentId).then(() => {
        const observables = [];
        Object.keys(service['blocksMap']).forEach(key => {
          observables.push(service['blocksMap'].get(key));
        });
        return Promise.all(observables.map(observable => {
          return awaitAndCheckObservable(observable);
        })).then(() => {
          expect().nothing();
          done();
        });
      }).catch(error => processTestError('ERROR in BlockQueryService', error, done));
    });

    it('should throw an error if graphQlService call fails', done => {
      // Setup the 'list' spy to throw an error
      const errorMessage = 'test error';
      listSpy.and.returnValue(Promise.reject(errorMessage));
      // now try to get blocks for a document
      service.getBlocksObservablesForDocument(documentId).then(() => {
        fail('error should have occurred'); done();
      }).catch(error => {
        expect(error).toEqual(errorMessage);
        done();
      });
    });
  });

  describe('subscribeToUpdate()', () => {

    it('should not subscribe to backend again if done once', () => {
      service.subscribeToUpdate(documentId);
      service.subscribeToUpdate(documentId);
      expect(subscriptionSpy.calls.count()).toBe(1);
    });

    it('should create a new observable in blocksMap if not exist', () => {
      // generate the mock subscription notification
      const response = {
        value: {
          data: {
            onUpdateBlockInDocument: MockAPIDataFactory.createBlock({ id })
          }
        }
      };
      // Setup code to test subscription
      service.subscribeToUpdate(documentId);
      // Now flush the response
      backendSubject.next(response);
      expect(service['blocksMap'].has(id)).toBe(true);
    });

    it('should throw an error if API returns one', done => {
      // setup subscription spy to throw an error
      const message = 'test message';
      service.subscribeToUpdate(documentId).subscribe(() => {}, error => {
        expect(error).toEqual(message);
        done();
      });
      // now tell the subscription to throw an error
      backendSubject.error(message);
    });

  });

  describe('registerBlockCreatedByUI', () => {
    let block: Block;
    let factory: BlockFactoryService;

    beforeEach(() => {
      factory = TestBed.get(BlockFactoryService);
      block = factory.createAppBlock(mockBlock);
    });

    it('should store the block in the internal map', done => {
      service.registerBlockCreatedByUI(block);
      service.getBlock$(id).subscribe(storedBlock => {
        if (storedBlock === null) {
          fail('stored block must have a value'); done();
        }
        expect(storedBlock.id).toEqual(id);
        done();
      }, () => fail('error getting stored block'));
    });
  });

  describe('registerBlockDeletedByUI', () => {
    let block: Block;
    let factory: BlockFactoryService;

    beforeEach(() => {
      factory = TestBed.get(BlockFactoryService);
      block = factory.createAppBlock(mockBlock);
    });
    it('should remove the stored block from the map', () => {
      service['blocksMap'] = new Map();
      service['blocksMap'].set(id, new BehaviorSubject(block));
      service.registerBlockDeletedByUI(id);
      expect(service['blocksMap'].has(id)).toBe(false);
    });
  });

});
