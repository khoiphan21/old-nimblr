import { TestBed } from '@angular/core/testing';

import { DocumentServiceImpl, DocumentFactory } from './document-impl.service';
import { AccountService } from '../account/account.service';
import { ServicesModule } from 'src/app/modules/services.module';

import { TEST_USERNAME, TEST_PASSWORD, TEST_USER_ID, BlankComponent } from '../account/account-impl.service.spec';
import { UserFactoryService } from '../user/user-factory.service';
import { DocumentImpl } from 'src/app/classes/document-impl';
import { UserImpl } from '../../classes/user-impl';
import { Document, DocumentType } from '../../classes/document';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { skip, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

describe('DocumentService', () => {
  let service: DocumentServiceImpl;
  let accountService: AccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlankComponent],
      providers: [
        DocumentServiceImpl
      ],
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([
          {
            path: 'login', component: BlankComponent
          }
        ])
      ]
    });

    accountService = TestBed.get(AccountService);
    service = TestBed.get(DocumentServiceImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have an observable current document', () => {
    expect(service.getCurrentDocument$()).toBeTruthy();
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
    accountService.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
      const subscription = service.getUserDocuments$();
      subscription.pipe(skip(1)).pipe(take(1)).subscribe(documents => {
        expect(documents.length).toBeGreaterThan(0);
        expect(documents[0] instanceof DocumentImpl).toBe(true);
        done();
      });
    });
  });

  it('should subscribe to the list of backend documents', done => {
    accountService.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
      let count = 0;
      let documentCount = 0;
      // let documentCount;
      const newDocumentId = new BehaviorSubject<string>(null);
      accountService.login(TEST_USERNAME, TEST_PASSWORD);

      service.getUserDocuments$().subscribe(documents => {
        switch (count) {
          case 0: // First value should be []
            return count++;
          case 1: // Get the first array of documents
            documentCount = documents.length;
            service.createFormDocument().then(document => {
              newDocumentId.next(document.id);
            });
            return count++;
          case 2: // After a new document is created
            expect(documentCount + 1).toBe(documents.length);
            newDocumentId.subscribe(id => {
              if (id) {
                service.deleteDocument(id).then(deletedDoc => {
                  done();
                });
              }
            });
            return count++;
          default:
            return;
        }
      });
    });
  }, 10000);
});

describe('DocumentFactory', () => {
  let userFactory: UserFactoryService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ServicesModule]
    });

    userFactory = TestBed.get(UserFactoryService);
  });

  it('should create a document', done => {
    const documentType = DocumentType.FORM;
    const rawDocument = {
      id: 'id',
      type: documentType,
      title: null,
      ownerId: TEST_USER_ID,
      editorIds: [],
      viewerIds: [],
      order: []
    };
    DocumentFactory.createDocument(rawDocument, userFactory).then((document: Document) => {
      expect(document instanceof DocumentImpl);
      expect(document.id).toBeTruthy();
      expect(document.owner instanceof UserImpl).toBe(true);
      expect(document.type === documentType).toBe(true);
      expect(document.order.length).toBeGreaterThanOrEqual(0);
      expect(document.editors.length).toBeGreaterThanOrEqual(0);
      expect(document.viewers.length).toBeGreaterThanOrEqual(0);
      done();
    });
  });
});
