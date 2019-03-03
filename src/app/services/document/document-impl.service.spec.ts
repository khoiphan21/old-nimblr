import { TestBed } from '@angular/core/testing';

import { DocumentServiceImpl } from './document-impl.service';
import { AccountService } from '../account/account.service';
import { ServicesModule } from 'src/app/modules/services.module';

import { TEST_USERNAME, TEST_PASSWORD, BlankComponent } from '../account/account-impl.service.spec';
import { DocumentImpl } from 'src/app/classes/document-impl';
import { RouterTestingModule } from '@angular/router/testing';
import { skip, take } from 'rxjs/operators';

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
});

