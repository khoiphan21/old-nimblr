import { TestBed } from '@angular/core/testing';

import { NavigationBarService } from './navigation-bar.service';
import { DocumentService } from '../document/document.service';
import { DocumentImpl } from '../../classes/document-impl';
import { UserImpl } from '../../classes/user-impl';
import { DocumentType } from 'src/app/classes/document';
import { AccountService } from '../account/account.service';
import { TEST_USERNAME, TEST_PASSWORD, BlankComponent } from '../account/account-impl.service.spec';
import { ServicesModule } from '../../modules/services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { skip, take } from 'rxjs/operators';

const sampleUser = new UserImpl('user123', 'test', 'user', 'test@email.com');
describe('NavigationBarService', () => {
  let accountService: AccountService;
  let documentService: DocumentService;
  let service: NavigationBarService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BlankComponent
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
    documentService = TestBed.get(DocumentService);
    service = TestBed.get(NavigationBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNavigationBar$', () => {

    it('should have an observable of Navigation Tabs', () => {
      expect(service.getNavigationBar$()).toBeTruthy();
    });

    it('should retrieve all documents for a user', done => {
      accountService.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
        let navigationTabCount = 0;
        let documentCount = 0;
        const documentSubscription = documentService.getUserDocuments$();
        documentSubscription.pipe(skip(1)).pipe(take(1)).subscribe((documents) => {
          documentCount = documents.length;
          const navigationSubscription = service.getNavigationBar$();
          navigationSubscription.subscribe((navigationTabs) => {
            navigationTabCount = navigationTabs.length;
            expect(navigationTabCount).toBe(documentCount);
            done();
          });
        });
      });
    });


    it('should update the navigation bar when a new document is created', done => {
      accountService.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
        const navigationSubscription = service.getNavigationBar$();
        let navigationTabCount = 0;
        let docId: string;
        navigationSubscription.pipe(skip(1)).pipe(take(1)).subscribe((navigationTabs) => {
          navigationTabCount = navigationTabs.length;
          console.log('1', navigationTabs.length);
          documentService.createFormDocument().then((document) => {
            docId = document.id;
            console.log(docId);
          });
        });
        // After document creation
        navigationSubscription.pipe(skip(2)).pipe(take(1)).subscribe((navigationTabs) => {
          console.log('2', navigationTabs.length);
          expect(navigationTabs.length).toBe(navigationTabCount + 1);
          navigationTabCount = navigationTabs.length;
          documentService.deleteDocument(docId);
          done();
        });
        // After document deletion
        // navigationSubscription.pipe(skip(3)).pipe(take(1)).subscribe((navigationTabs) => {
        //   console.log('3', navigationTabs.length);
        //   expect(navigationTabs.length).toBe(navigationTabCount - 1);
        // });
      });
    });
  });

  describe('processNavigationTab()', () => {
    const sampleDocument = new DocumentImpl('doc1', DocumentType.GENERIC, 'Test 1', sampleUser, [], [], []);
    const sampleDocument2 = new DocumentImpl('doc2', DocumentType.GENERIC, 'Test 2', sampleUser, [], [], []);

    it('should extract the right details from `Document` object to `NavigationTab`', () => {
      const sampleDocuments = [sampleDocument, sampleDocument2];
      const processedDatas = service.processNavigationTab(sampleDocuments);
      expect(processedDatas.length).toBe(2);
      processedDatas.forEach((data, index) => {
        expect(data.id).toEqual(sampleDocuments[index].id);
        expect(data.title).toEqual(sampleDocuments[index].title);
      });
    });
  });
});
