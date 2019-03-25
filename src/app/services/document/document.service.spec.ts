import { TestBed } from '@angular/core/testing';

import { DocumentService } from './document.service';
import { AccountService } from '../account/account.service';

import { RouterTestingModule } from '@angular/router/testing';
import { AccountServiceImpl } from '../account/account-impl.service';
import { UUID } from './command/document-command.service';
import { GraphQLError } from '../graphQL/error';
import { listDocuments } from 'src/graphql/queries';
import { DocumentType } from 'src/API';
import { createDocument, deleteDocument } from 'src/graphql/mutations';
import { take, skip } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { DocumentFactoryService } from './factory/document-factory.service';
import { Document } from 'src/app/classes/document';
import { configureTestSuite } from 'ng-bullet';
const uuidv4 = require('uuid/v4');

describe('DocumentService', () => {
  let service: DocumentService;
  let documentFactory: DocumentFactoryService;
  // spies
  let querySpy: jasmine.Spy;
  let accountServiceSpy: jasmine.Spy;
  // mock data
  let listQueryResponse: any;
  let documentData: any;
  let userId: UUID;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentService,
        {
          provide: AccountService,
          useClass: AccountServiceImpl
        }
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(DocumentService);
    documentFactory = TestBed.get(DocumentFactoryService);

    // setup variables for testing
    userId = uuidv4();

    setupGraphQLServiceSpy();
    setupAccountServiceSpy();
  });

  function setupGraphQLServiceSpy() {
    /* tslint:disable:no-string-literal */
    // Spy on the graphQlService 'query' function
    querySpy = spyOn(service['graphQlService'], 'query');
    // Setup the default response values for the spy
    documentData = { id: uuidv4(), ownerId: uuidv4() };
    // the mock response
    listQueryResponse = {
      data: {
        listDocuments: {
          items: [documentData]
        }
      }
    };
  }

  function setupAccountServiceSpy() {
    // Setup the AccountService spy
    accountServiceSpy = spyOn(service['accountService'], 'isUserReady');
    accountServiceSpy.and.returnValue(Promise.resolve({
      id: userId
    }));
  }

  describe('constructor()', () => {

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have an observable current document', () => {
      expect(service.getCurrentDocument$()).toBeTruthy();
    });

  });


  /* tslint:disable:no-string-literal */
  describe('getDocumentsForUserId()', () => {

    beforeEach(() => {
      // tell the spy to return the expected data
      querySpy.and.returnValue(Promise.resolve(listQueryResponse));
    });

    it('should return the right number of documents', done => {
      service['getDocumentsForUserId'](userId).then(documents => {
        expect(documents.length).toBe(1);
        done();
      });
    });

    it('should return the document with the correct id', done => {
      service['getDocumentsForUserId'](userId).then(documents => {
        expect(documents[0].id).toBe(documentData.id);
        done();
      });
    });

    describe('[ERROR - GraphQLError]', () => {

      let backendResponse: any;

      beforeEach(() => {
        // Setup the spy to fail the promise
        backendResponse = new Error('test');
        querySpy.and.returnValue(Promise.reject(backendResponse));
      });

      it('should throw an error with the right message', done => {
        const expectedMessage = `failed to retrieve documents for user ${userId}`;
        // Now call the service
        service['getDocumentsForUserId'](userId).then(() => {
          fail('error must occur'); done();
        }).catch(error => {
          expect(error.message).toEqual(expectedMessage);
          done();
        });
      });

      it('should throw an error with query listDocuments', done => {
        // Now call the service
        service['getDocumentsForUserId'](userId).then(() => {
          fail('error must occur'); done();
        }).catch(error => {
          expect(error.query).toEqual(listDocuments);
          done();
        });
      });

      it('should throw an error with the right argument', done => {
        const expectedArg = {
          filter: {
            ownerId: {
              eq: userId
            }
          }
        };
        // Now call the service
        service['getDocumentsForUserId'](userId).then(() => {
          fail('error must occur'); done();
        }).catch((error: GraphQLError) => {
          expect(error.params).toEqual(expectedArg);
          done();
        });
      });

      it('should throw an error with the right backend response', done => {
        // Now call the service
        service['getDocumentsForUserId'](userId).then(() => {
          fail('error must occur'); done();
        }).catch((error: GraphQLError) => {
          expect(error.backendResponse).toEqual(backendResponse);
          done();
        });
      });

    });

  });

  describe('createFormDocument()', () => {
    let createdDocumentResponse: any;
    let documentId: UUID;
    let version: UUID;

    beforeEach(() => {
      setupResponse();
      setupSpies();
    });

    function setupResponse() {
      documentId = uuidv4();
      version = uuidv4();

      createdDocumentResponse = {
        id: documentId,
        type: DocumentType.FORM,
        title: null,
        ownerId: userId,
        editorIds: [],
        viewerIds: [],
        blockIds: [],
        lastUpdatedBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    function setupSpies() {
      // Setup the graphql servicespy
      querySpy.and.returnValue(Promise.resolve({
        data: {
          createDocument: createdDocumentResponse
        }
      }));
    }

    it('should resolve a document with the right details', done => {
      service.createFormDocument().then(createdDocument => {
        // Check generic properties
        ['id', 'type', 'title', 'ownerId', 'editorIds', 'viewerIds',
          'blockIds', 'lastUpdatedBy', 'createdAt', 'updatedAt'
        ].forEach(property => {
          expect(createdDocument[property]).toEqual(createdDocumentResponse[property]);
        });
        done();
      });
    });

    describe('[ERROR - GraphQLService]', () => {

      let backendResponse: any;

      beforeEach(() => {
        // Setup the spy to fail the promise
        backendResponse = new Error('test');
        querySpy.and.returnValue(Promise.reject(backendResponse));
      });

      it('should throw an error with the right message', done => {
        const expectedMessage = `failed to create form document`;
        // Now call the service
        service.createFormDocument().then(() => {
          fail('error must occur'); done();
        }).catch(error => {
          expect(error.message).toEqual(expectedMessage);
          done();
        });
      });


      it('should throw an error with query createDocument', done => {
        // Now call the service
        service.createFormDocument().then(() => {
          fail('error must occur'); done();
        }).catch(error => {
          expect(error.query).toEqual(createDocument);
          done();
        });
      });

      it('should throw an error with the right argument', done => {
        const expectedArg = {
          input: {
            type: DocumentType.FORM,
            title: null,
            ownerId: userId,
            editorIds: [],
            viewerIds: [],
            order: []
          }
        };
        // Now call the service
        service.createFormDocument().then(() => {
          fail('error must occur'); done();
        }).catch((error: GraphQLError) => {
          expect(error.params).toEqual(expectedArg);
          done();
        });
      });

      it('should throw an error with the right backend response', done => {
        // Now call the service
        service.createFormDocument().then(() => {
          fail('error must occur'); done();
        }).catch((error: GraphQLError) => {
          expect(error.backendResponse).toEqual(backendResponse);
          done();
        });
      });
    });

  });

  describe('getUserDocuments$()', () => {
    let subscriptionSpy: jasmine.Spy;
    let getDocumentsSpy: jasmine.Spy;

    beforeEach(() => {
      // Setup the subscription method spy
      subscriptionSpy = spyOn<any>(service, 'setupSubscriptionForUserDocuments');
      // Setup spy for getDocumentsForUserId
      getDocumentsSpy = spyOn<any>(service, 'getDocumentsForUserId');
      getDocumentsSpy.and.returnValue(new Promise(() => { }));
    });

    it('should return an observable with an initially empty array', done => {
      service.getUserDocuments$().pipe(take(1)).subscribe(docs => {
        expect(docs.length).toBe(0);
        done();
      });
    });

    it('should not call account service again after called once', () => {
      service.getUserDocuments$();
      service.getUserDocuments$();
      expect(subscriptionSpy.calls.count()).toBe(1);
    });

    it('should call account service to check', () => {
      service.getUserDocuments$();
      expect(accountServiceSpy.calls.count()).toBe(1);
    });

    it('should emit an error if the user is not logged in', done => {
      // Tell account service to reject
      accountServiceSpy.and.returnValue(Promise.reject());
      // The expected error message
      const expectedMessage = 'Error getting documents: User is not logged in';
      service.getUserDocuments$().subscribe(() => { }, error => {
        expect(error).toEqual(expectedMessage);
        done();
      });
    });

    it('should call to get documents for the user if logged in', done => {
      // setup get documents to return an empty array
      getDocumentsSpy.and.returnValue(Promise.resolve([]));
      // now call to get user documents
      service.getUserDocuments$().pipe(skip(1)).pipe(take(1))
        .subscribe(documents => {
          expect(documents.length).toBe(0);
          done();
        });
    });
  });

  describe('setupSubscription...()', () => {
    let subscriptionSpy: jasmine.Spy;
    let getDocumentsSpy: jasmine.Spy;
    let backendSubject: Subject<any>;
    let testDocument: Document;

    beforeEach(() => {
      // setup the userDocument$ subject
      // Note: this needs to be setup before running each test
      service['userDocuments$'] = new BehaviorSubject([]);
      // Setup the spy for graphql subscription call
      subscriptionSpy = spyOn(service['graphQlService'], 'getSubscription');
      backendSubject = new Subject();
      subscriptionSpy.and.returnValue(backendSubject);
      // setup the document to be returned when getUserDocument is called;
      testDocument = documentFactory.createDocument(
        { id: uuidv4(), ownerId: uuidv4() }
      );
      // Setup the spy for getDocumentsForUserId()
      getDocumentsSpy = spyOn<any>(service, 'getDocumentsForUserId');
      getDocumentsSpy.and.returnValue(Promise.resolve([testDocument]));
    });

    it('should reject if the user is not logged in', done => {
      accountServiceSpy.and.returnValue(Promise.reject());
      service['setupSubscriptionForUserDocuments']().then(() => {
        fail('error must occur'); done();
      }).catch(error => {
        expect(error.message).toEqual(
          'Unable to setup subscription for user documents'
        );
        done();
      });
    });

    it('should call getDocumentsForUserId() when notified', done => {
      service['setupSubscriptionForUserDocuments']().then(() => {
        backendSubject.next(null);
        expect(getDocumentsSpy.calls.count()).toBe(1);
        expect(getDocumentsSpy.calls.mostRecent().args[0]).toBe(userId);
        done();
      });
    });

    it('should emit the new documents when notified', done => {
      // then call the service
      service['setupSubscriptionForUserDocuments']().then(() => {
        backendSubject.next(null);
        service['userDocuments$'].pipe(skip(1)).subscribe(value => {
          expect(value[0]).toEqual(testDocument);
          done();
        });
      });
    });

    it('should emit an error if unable to get subscription', done => {
      // setup the subscriptionSpy to throw an error
      const message = `Unable to setup subscription for user documents: failed to call graphQl`;
      backendSubject.error(message);
      // setup the subscription to user documents
      service['userDocuments$'].subscribe(() => { }, error => {
        expect(message).toEqual(message);
        done();
      });
      // now call the service
      service['setupSubscriptionForUserDocuments']();
    });

  });

  describe('deleteDocument()', () => {
    let id: UUID;
    let deletedDocument: Document;

    beforeEach(() => {
      // setup the mock deleted document
      id = uuidv4();
      deletedDocument = documentFactory.createDocument({
        id, ownerId: uuidv4()
      });
      // setup the return value of query spy
      querySpy.and.returnValue(Promise.resolve(deletedDocument));
    });

    it('should call the graphQl query to delete', done => {
      service.deleteDocument(id).then(() => {
        expect(querySpy.calls.mostRecent().args[0]).toBe(deleteDocument);
        done();
      });
    });

    it('should call the graphQl query with the right argument', done => {
      service.deleteDocument(id).then(() => {
        expect(querySpy.calls.mostRecent().args[1]).toEqual({input: {id}});
        done();
      });
    });

    it('should should return the deleted document', done => {
      service.deleteDocument(id).then(value => {
        expect(value).toEqual(deletedDocument);
        done();
      });
    });

    it('should throw an error if failed to delete', done => {
      // setup the spy to throw an error
      const backendMessage = 'test';
      querySpy.and.returnValue(Promise.reject(Error(backendMessage)));
      // setup the expected message
      const expectedMessage = 'Unable to delete document: ' + backendMessage;
      // call the service
      service.deleteDocument(id).catch(error => {
        expect(error.message).toEqual(expectedMessage);
        done();
      });
    });

  });

});
