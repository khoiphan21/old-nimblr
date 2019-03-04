import { TestBed } from '@angular/core/testing';

import { NavigationBarService } from './navigation-bar.service';
import { DocumentService } from '../document/document.service';
import { UserImpl } from '../../classes/user-impl';
import { AccountService } from '../account/account.service';
import { TEST_USERNAME, TEST_PASSWORD, BlankComponent } from '../account/account-impl.service.spec';
import { ServicesModule } from '../../modules/services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { skip, take } from 'rxjs/operators';
import { DocumentFactoryService } from '../document/document-factory.service';

const uuidv4 = require('uuid/v4');

const sampleUser = new UserImpl('user123', 'test', 'user', 'test@email.com');

describe('NavigationBarService', () => {
  let accountService: AccountService;
  let documentService: DocumentService;
  let service: NavigationBarService;
  let documentFactory: DocumentFactoryService;
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
    documentFactory = TestBed.get(DocumentFactoryService);
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
        navigationSubscription.pipe(skip(1)).pipe(take(1)).subscribe((navigationTabs) => {
          navigationTabCount = navigationTabs.length;
          documentService.createFormDocument().then((document) => {
          });
        });
        // After document creation
        navigationSubscription.pipe(skip(2)).pipe(take(1)).subscribe((navigationTabs) => {
          expect(navigationTabs.length).toBe(navigationTabCount + 1);
          navigationTabCount = navigationTabs.length;
          done();
        });
      });
    });

    xit('should update the navigation bar when a new document is deleted', done => {
      accountService.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
        const navigationSubscription = service.getNavigationBar$();
        let navigationTabCount = 0;
        navigationSubscription.pipe(skip(1)).pipe(take(1)).subscribe((navigationTabs) => {
          navigationTabCount = navigationTabs.length;
          const docId = navigationTabs[0].id;
          documentService.deleteDocument(docId);
        });
        // After document deletion
        navigationSubscription.pipe(skip(2)).pipe(take(1)).subscribe((navigationTabs) => {
          expect(navigationTabs.length).toBe(navigationTabCount - 1);
          done();
        });
      });
    });
  });

  describe('processNavigationTab()', () => {
    const sampleDocument = documentFactory.createDocument({
      id: uuidv4(),
      ownerId: uuidv4(),
      title: 'Test title'
    });
    const sampleDocument2 = documentFactory.createDocument({
      id: uuidv4(),
      ownerId: uuidv4(),
      title: 'Test title'
    });

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
