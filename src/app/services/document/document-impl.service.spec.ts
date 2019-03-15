import { TestBed } from '@angular/core/testing';

import { DocumentServiceImpl } from './document-impl.service';
import { AccountService } from '../account/account.service';

import { RouterTestingModule } from '@angular/router/testing';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { AccountServiceImpl } from '../account/account-impl.service';
import { UUID } from './command/document-command.service';

const uuidv4 = require('uuid/v4');

fdescribe('DocumentService', () => {
  let service: DocumentServiceImpl;
  let querySpy: jasmine.Spy;
  let listQueryResponse: any;
  let documentData: any;
  let userId: UUID;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentServiceImpl,
        {
          provide: AccountService,
          useClass: AccountServiceImpl
        }
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    });

    service = TestBed.get(DocumentServiceImpl);

    // setup variables for testing
    userId = uuidv4();

    setupGraphQLServiceSpy();
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

  it('should be created', () => {
    expect(service).toBeTruthy();
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

  });

  it('should have an observable current document', () => {
    expect(service.getCurrentDocument$()).toBeTruthy();
  });

});
