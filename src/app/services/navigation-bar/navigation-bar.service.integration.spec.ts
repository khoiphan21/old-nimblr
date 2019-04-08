import { TestBed } from '@angular/core/testing';

import { NavigationBarService } from './navigation-bar.service';
import { DocumentService } from '../document/document.service';
import { AccountService } from '../account/account.service';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { ServicesModule } from '../../modules/services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { skip, take } from 'rxjs/operators';
import { DocumentFactoryService } from '../document/factory/document-factory.service';
import { environment } from '../../../environments/environment';
import { DocumentCommandService } from '../document/command/document-command.service';
import { CreateDocumentInput, SharingStatus, DocumentType } from 'src/API';

const uuidv4 = require('uuid/v4');

describe('(Integration) NavigationBarService', () => {
  let accountService: AccountService;
  let documentService: DocumentService;
  let documentCommandService: DocumentCommandService;
  let service: NavigationBarService;
  let documentFactory: DocumentFactoryService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([])
      ]
    });
    accountService = TestBed.get(AccountService);
    documentService = TestBed.get(DocumentService);
    documentFactory = TestBed.get(DocumentFactoryService);
    documentCommandService = TestBed.get(DocumentCommandService);
    service = TestBed.get(NavigationBarService);
  });

  describe('getNavigationBar$', () => {

    it('should retrieve all documents for a user', done => {
      accountService.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
        let navigationTabCount = 0;
        let documentCount = 0;
        const documentSubscription = documentService.getUserDocuments$();
        documentSubscription.pipe(skip(1)).pipe(take(1)).subscribe(documents => {
          documentCount = documents.length;
          const navigationSubscription = service.getNavigationBar$();

          // now check if the navigation tabs count are corrent
          navigationSubscription.pipe(skip(1)).pipe(take(1)).subscribe((navigationTabs) => {
            navigationTabCount = navigationTabs.length;
            expect(navigationTabCount).toBe(documentCount);
            done();
          });
        });
      });
    });

    it('should update the navigation bar when a new document is created', done => {
      accountService.login(TEST_USERNAME, TEST_PASSWORD).then(user => {
        let navigationTabCount = 0;
        let originalCount: number;
        const input: CreateDocumentInput = {
          version: uuidv4(),
          type: DocumentType.GENERIC,
          ownerId: user.id,
          lastUpdatedBy: user.id,
          sharingStatus: SharingStatus.PRIVATE
        };
        service.getNavigationBar$().pipe(skip(2)).pipe(take(2)).subscribe(navigationTabs => {
          navigationTabCount = navigationTabs.length;
          if (originalCount === undefined) {
            originalCount = navigationTabCount;
          }
          switch (navigationTabCount) {
            case originalCount:
              setTimeout(() => {
                documentCommandService.createDocument(input);
              }, environment.WAIT_TIME_BEFORE_UPDATE);
              break;
            case originalCount + 1:
              const docId = navigationTabs[0].id;
              documentService.deleteDocument(docId).then(() => {
                done();
              });
              break;
            default:
              fail('Number of tabs counted is wrong: ' + navigationTabCount);
              done();
              break;
          }
        }, error => {
          fail('error getting navigation bars');
          console.error(error);
          done();
        });
      });
    }, environment.TIMEOUT_FOR_UPDATE_TEST);

    xit('should update the navigation bar when a new document is deleted', done => {
      accountService.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
        const navigationSubscription = service.getNavigationBar$();
        let navigationTabCount = 0;
        navigationSubscription.pipe(skip(1)).pipe(take(1)).subscribe((navigationTabs) => {
          navigationTabCount = navigationTabs.length;

        });
        // After document deletion
        navigationSubscription.pipe(skip(2)).pipe(take(1)).subscribe((navigationTabs) => {
          expect(navigationTabs.length).toBe(navigationTabCount - 1);
          done();
        });
      });
    });
  });

});
