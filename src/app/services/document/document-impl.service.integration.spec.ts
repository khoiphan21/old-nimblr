import { TestBed } from '@angular/core/testing';

import { DocumentService } from './document.service';
import { AccountService } from '../account/account.service';
import { ServicesModule } from 'src/app/modules/services.module';

import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { DocumentImpl } from 'src/app/classes/document-impl';
import { RouterTestingModule } from '@angular/router/testing';
import { skip, take } from 'rxjs/operators';
import { processTestError } from 'src/app/classes/test-helpers.spec';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { createDocument, deleteDocument } from '../../../graphql/mutations';
import { CreateDocumentInput, DocumentType, SharingStatus } from '../../../API';
import { Document } from 'src/app/classes/document';
import { User } from 'src/app/classes/user';

const uuidv4 = require('uuid/v4');

describe('(Integration) DocumentService', () => {
  let service: DocumentService;
  let accountService: AccountService;
  let graphQlService: GraphQLService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentService
      ],
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([])
      ]
    });

    accountService = TestBed.get(AccountService);
    service = TestBed.get(DocumentService);
    graphQlService = TestBed.get(GraphQLService);
  });

  it('should emit a new document object upon successful creation', done => {
    accountService.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
      service.getCurrentDocument$().subscribe(document => {
        if (!document) { return; }
        // some result is returned. success.
        expect(document instanceof DocumentImpl).toBe(true);
        service.deleteDocument(document.id).then(() => {
          done();
        });
      }, error => {
        console.error(error);
        fail('Error occurred. View console for more details.');
        done();
      });
      service.createFormDocument();
    });
  });

  it('should retrieve all documents for a user', done => {
    let document: Document;
    const input: CreateDocumentInput = {
      type: DocumentType.GENERIC,
      version: uuidv4(),
      ownerId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      sharingStatus: SharingStatus.PRIVATE
    };

    accountService.login(TEST_USERNAME, TEST_PASSWORD).then((user: User) => {
      input.ownerId = user.id;
      return graphQlService.query(createDocument, { input });
    }).then(response => {
      document = response.data.createDocument;
      return getFirstDocumentSet(service);
    }).then(documents => {
      expect(documents.length).toBeGreaterThan(0);
      expect(documents[0] instanceof DocumentImpl).toBe(true);
      return graphQlService.query(deleteDocument, { input: { id: document.id } });
    }).then(() => done()
    ).catch(error => processTestError('failed to retrieve docs', error, done));

    function getFirstDocumentSet(service: DocumentService): Promise<Array<Document>> {
      return new Promise((resolve, reject) => {
        const subscription = service.getUserDocuments$();
        subscription.pipe(skip(1)).pipe(take(1)).subscribe(documents => {
          if (documents === null) { return; }
          resolve(documents);
        }, error => reject(error));
      });
    }
  });
});

  // it('should subscribe to the list of backend documents', done => {
  //   accountService.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
  //     let count = 0;
  //     let documentCount = 0;
  //     // let documentCount;
  //     const newDocumentId = new BehaviorSubject<string>(null);
  //     accountService.login(TEST_USERNAME, TEST_PASSWORD);

  //     service.getUserDocuments$().subscribe(documents => {
  //       switch (count) {
  //         case 0: // First value should be []
  //           return count++;
  //         case 1: // Get the first array of documents
  //           documentCount = documents.length;
  //           service.createFormDocument().then(document => {
  //             newDocumentId.next(document.id);
  //           });
  //           return count++;
  //         case 2: // After a new document is created
  //           expect(documentCount + 1).toBe(documents.length);
  //           newDocumentId.subscribe(id => {
  //             if (id) {
  //               service.deleteDocument(id).then(deletedDoc => {
  //                 done();
  //               });
  //             }
  //           });
  //           return count++;
  //         default:
  //           return;
  //       }
  //     });
  //   });
  // }, environment.TIMEOUT_FOR_UPDATE_TEST);

