import { TestBed } from '@angular/core/testing';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';

import { DocumentQueryService } from './document-query.service';
import { take, skip } from 'rxjs/operators';
import { getDocument } from 'src/graphql/queries';
import { UUID } from '../command/document-command.service';
import { DocumentFactoryService } from '../factory/document-factory.service';
import { DocumentImpl } from 'src/app/classes/document/document-impl';
import { onSpecificDocumentUpdate } from 'src/graphql/subscriptions';
import { Document } from 'src/app/classes/document/document';

const uuidv4 = require('uuid/v4');

describe('DocumentQueryService', () => {
  let service: DocumentQueryService;
  let factory: DocumentFactoryService;
  // mock data for testing
  let backendResponse: Document;
  let id: UUID;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(DocumentQueryService);
    factory = TestBed.get(DocumentFactoryService);
    // setup mock data
    id = uuidv4();
    backendResponse = factory.createDocument({ id, ownerId: uuidv4() });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* tslint:disable:no-string-literal */
  describe('getDocument$', () => {
    let subscribeToUpdateSpy: jasmine.Spy;
    let querySpy: jasmine.Spy;

    beforeEach(() => {
      // setup the spies
      subscribeToUpdateSpy = spyOn<any>(service, 'subscribeToUpdate');
      // setup query spy to return an promise that never resolves
      querySpy = spyOn(service['graphQlService'], 'query');
      querySpy.and.returnValue(new Promise(() => { }));
    });

    describe('creating and returning an observable', () => {
      it('should return an observable with initial value of null', done => {
        service.getDocument$(id).pipe(take(1)).subscribe(value => {
          expect(value).toBe(null);
          done();
        });
      });
      it('should have a new observable mapped to the id in the documentMap', () => {
        service.getDocument$(id);
        expect(service['documentMap'].has(id)).toBe(true);
      });
      it('should store the observable in the documentMap', () => {
        const observable = service.getDocument$(id);
        expect(service['documentMap'].get(id) as any).toBe(observable);
      });
      it('should not create a new observable for an id if already created', () => {
        const document$ = service.getDocument$(id);
        const anotherDocument$ = service.getDocument$(id);
        expect(document$).toBe(anotherDocument$);
      });
    });

    describe('calling subscribeToUpdate()', () => {
      it('should call the method to subscribe to updates', () => {
        service.getDocument$(id);
        expect(subscribeToUpdateSpy.calls.count()).toBe(1);
      });
      it('should call to subscribe with the right argument', () => {
        service.getDocument$(id);
        expect(subscribeToUpdateSpy.calls.mostRecent().args[0]).toBe(id);
      });
      it('should not call subscribe again if the map already has one', () => {
        // create a new item in the map
        service['subscriptionMap'].set(id, null);
        service.getDocument$(id);
        expect(subscribeToUpdateSpy.calls.count()).toBe(0);
      });
    });

    describe('calling graphQlService.query()', () => {

      describe('checking arguments', () => {
        beforeEach(() => {
          service.getDocument$(id);
        });
        it('should call with the right GraphQL query type', () => {
          expect(querySpy.calls.mostRecent().args[0]).toEqual(getDocument);
        });
        it('should call with the right argument', () => {
          expect(querySpy.calls.mostRecent().args[1]).toEqual({ id });
        });
      });

      describe('[SUCCESS]', () => {

        beforeEach(() => {
          // setup querySpy to return the document
          querySpy.and.returnValue(Promise.resolve({
            data: { getDocument: backendResponse }
          }));
        });

        it('should create and emit a document from raw data', done => {
          service.getDocument$(id).pipe(skip(1)).subscribe(value => {
            expect(value instanceof DocumentImpl).toBe(true);
            done();
          });
        });

        it('should emit the document with the right id', done => {
          service.getDocument$(id).pipe(skip(1)).subscribe(document => {
            expect(document.id).toBe(backendResponse.id);
            done();
          });
        });

        it('should emit an error if the data is null', done => {
          // setup querySpy to return a null value for document data
          querySpy.and.returnValue(Promise.resolve({
            data: { getDocument: null }
          }));
          service.getDocument$(id).subscribe(() => { }, error => {
            const expectedMessage = `Document with id ${id} does not exist`;
            expect(error.message).toEqual(expectedMessage);
            done();
          });
        });

        it('should emit an error if the response is null', done => {
          // setup querySpy to return a null value
          querySpy.and.returnValue(Promise.resolve(null));
          service.getDocument$(id).subscribe(() => { }, error => {
            const backendMessage = `Cannot read property 'data' of null`;
            const expectedMessage = `Unable to parse response: ${backendMessage}`;
            expect(error.message).toEqual(expectedMessage);
            done();
          });
        });

        it('should emit the error thrown by the factory', done => {
          // setup factory to throw an error
          const message = 'test';
          spyOn(service['documentFactory'], 'createDocument')
            .and.throwError(message);
          // call service
          service.getDocument$(id).subscribe(() => { }, error => {
            expect(error.message).toEqual(message);
            done();
          });
        });
      });

      describe('[ERROR]', () => {
        it('should emit the error thrown by the query method', done => {
          // setup query spy to throw an error
          const expectedMessage = `[DocumentQueryService] Unable to send query: test`;
          querySpy.and.returnValue(Promise.reject(Error('test')));
          // call service
          service.getDocument$(id).subscribe(() => { }, error => {
            expect(error.message).toEqual(expectedMessage);
            done();
          });
        });
      });
    });

  });

  /* tslint:disable:no-string-literal */
  describe('registerUpdateVersion()', () => {
    it('should store the given version', () => {
      const version = uuidv4();
      service.registerUpdateVersion(version);
      expect(service['myVersions'].has(version)).toBe(true);
    });
  });

  describe('subscribeToUpdate()', () => {
    let getSubscriptionSpy: jasmine.Spy;

    beforeEach(() => {
      // setup spy for getSubscription()
      getSubscriptionSpy = spyOn(service['graphQlService'], 'getSubscription');
      getSubscriptionSpy.and.returnValue(new Subject());
    });

    it('should store a subscription into the internal map', () => {
      service['subscribeToUpdate'](id);
      expect(service['subscriptionMap'].get(id) instanceof Subscription).toBe(true);
    });

    describe('calling getSubscription()', () => {
      let backendSubject: Subject<any>;

      function notify() {
        backendSubject.next({
          value: { data: { onSpecificDocumentUpdate: backendResponse } }
        });
      }

      beforeEach(() => {
        // Setup the subscription spy to return the monitored observable
        backendSubject = new Subject();
        getSubscriptionSpy.and.returnValue(backendSubject);
        // setup the observable for the document
        service['documentMap'].set(id, new BehaviorSubject<Document>(null));
      });

      describe('arguments checking', () => {
        let callArgs: Array<any>;

        beforeEach(() => {
          // call the service and get the arguments
          service['subscribeToUpdate'](id);
          callArgs = getSubscriptionSpy.calls.mostRecent().args;
        });

        it('should call with the right subscription query', () => {
          expect(callArgs[0]).toEqual(onSpecificDocumentUpdate);
        });
        it('should call with the right argument', () => {
          expect(callArgs[1]).toEqual({ id });
        });
      });

      describe('[SUCCESS]', () => {
        it('should create and emit the notified document', done => {
          service['subscribeToUpdate'](id);
          service['documentMap'].get(id).pipe(skip(1)).subscribe(value => {
            expect(value instanceof DocumentImpl).toBe(true);
            done();
          });
          notify();
        });
        it('should not emit if the version is already stored', done => {
          // first store the version
          service.registerUpdateVersion(backendResponse.version);
          // Then call the service
          service['subscribeToUpdate'](id);
          service['documentMap'].get(id).subscribe(value => {
            if (value === null) {
              // set timeout to call done
              setTimeout(() => done(), 5);
              return;
            }
            fail('should not have been notified');
            done();
          });
          notify();
        });
      });

      describe('[ERROR]', () => {
        it('should emit an error if the data is null', done => {
          service['subscribeToUpdate'](id);
          service['documentMap'].get(id).subscribe(() => { }, error => {
            const message = `Unable to parse data: Cannot read property 'value' of null`;
            expect(error.message).toBe(message);
            done();
          });
          backendSubject.next(null);
        });
        it('should emit the error thrown by factory', done => {
          // setup factory to throw an error
          const message = 'test';
          spyOn(service['documentFactory'], 'createDocument')
            .and.throwError(message);
          // call the service
          service['subscribeToUpdate'](id);
          service['documentMap'].get(id).subscribe(() => { }, error => {
            const value = `DocumentFactory failed to create document: ${message}`;
            expect(error.message).toBe(value);
            done();
          });
          notify();
        });

        describe('when thrown by GraphQL API', () => {
          it('should emit the error directly', done => {
            const mockError = new Error('test');
            service['subscribeToUpdate'](id);
            service['documentMap'].get(id).subscribe(() => { }, error => {
              const message = `Error from notification: ${mockError.message}`;
              expect(error.message).toBe(message);
              done();
            });
            backendSubject.error(mockError);
          });
          it('should remove the subscription from the map', done => {
            service['subscribeToUpdate'](id);
            service['documentMap'].get(id).subscribe(() => { }, () => {
              expect(service['subscriptionMap'].has(id)).toBe(false);
              done();
            });
            backendSubject.error(`test`);
          });
        });
      });
    });
  });

});
