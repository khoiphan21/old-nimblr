import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPageComponent } from './document-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ServicesModule } from '../../modules/services.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account/account.service';
import { MockAccountService } from 'src/app/services/account/account-impl.service.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { configureTestSuite } from 'ng-bullet';
import { User } from 'src/app/classes/user';
import { Subject, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DocumentFactoryService } from 'src/app/services/document/factory/document-factory.service';
import { Document } from 'src/app/classes/document';
import { isUuid } from 'src/app/classes/helpers';
import { DocumentCommandService } from 'src/app/services/document/command/document-command.service';
import { domRendererFactory3 } from '@angular/core/src/render3/interfaces/renderer';
import { DocumentType } from 'src/API';

const uuidv4 = require('uuid/v4');

describe('DocumentPageComponent', () => {
  let component: DocumentPageComponent;
  let fixture: ComponentFixture<DocumentPageComponent>;
  let documentFactory: DocumentFactoryService;

  // mock data for testing
  const id = uuidv4();
  const testUser: User = {
    id,
    firstName: 'first',
    lastName: 'last',
    email: 'abcd@email.com'
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentPageComponent,
      ],
      imports: [
        ServicesModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: AccountService,
          useClass: MockAccountService
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: new BehaviorSubject({
              get: () => id
            })
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentPageComponent);
    component = fixture.componentInstance;
    documentFactory = TestBed.get(DocumentFactoryService);
  });

  /* tslint:disable:no-string-literal */
  describe('ngOnInit()', () => {
    let checkUserSpy: jasmine.Spy;
    let retrieveDocumentSpy: jasmine.Spy;

    beforeEach(() => {
      // setup the spies
      checkUserSpy = spyOn(component, 'checkUser');
      retrieveDocumentSpy = spyOn<any>(component, 'retrieveDocumentData');
      checkUserSpy.and.returnValue(Promise.resolve(testUser));
    });

    it('should call to check the user', () => {
      checkUserSpy.and.returnValue(new Promise(() => { }));
      // now call ngOnInit
      component.ngOnInit();
      expect(checkUserSpy.calls.count()).toBe(1);
    });

    describe('[SUCCESS]', () => {

      it('should store the retrieved user', done => {
        component.ngOnInit().then(() => {
          expect(component['currentUser']).toEqual(testUser);
          done();
        });
      });

      it('should set user to be logged in', async () => {
        await component.ngOnInit();
        expect(component.isUserLoggedIn).toBe(true);
      });

      it('should call retrieveDocumentData', done => {
        component.ngOnInit().then(() => {
          expect(retrieveDocumentSpy.calls.count()).toBe(1);
          done();
        });
      });
    });

    describe('[ERROR]', () => {

      it('should set isUserLoggedIn to false if not logged in', async () => {
        checkUserSpy.and.returnValue(Promise.reject());
        await component.ngOnInit();
        expect(component.isUserLoggedIn).toBe(false);
      });

      it('should throw an error if failed to retrieve document data', done => {
        const errorMessage = 'test';
        retrieveDocumentSpy.and.throwError(errorMessage);
        component.ngOnInit().catch(error => {
          const message = `DocumentPage failed to load: ${errorMessage}`;
          expect(error.message).toEqual(message);
          done();
        });
      });

    });

  });

  describe('checkUser()', () => {
    let accountServiceSpy: jasmine.Spy;
    let userObservable: BehaviorSubject<User>;

    beforeEach(() => {
      userObservable = new BehaviorSubject(null);
      accountServiceSpy = spyOn(component['accountService'], 'getUser$');
      accountServiceSpy.and.returnValue(userObservable);
    });

    it('should resolve with the user retrieved from account service', done => {
      // Spy on the account service
      component.checkUser().then(user => {
        expect(user).toEqual(testUser);
        done();
      });
      userObservable.next(testUser);
    });

    it('should reject if failed to get user', done => {
      const testError = new Error('test');
      component.checkUser().catch(error => {
        const message = `DocumentPage failed to load: ${testError.message}`;
        expect(error.message).toEqual(message);
        done();
      });
      userObservable.error(testError);
    });
  });

  describe('retrieveDocumentData()', () => {
    const getDocument$ = new Subject();
    let document: Document;
    let getDocumentSpy: jasmine.Spy;
    let setupSubscriptionSpy: jasmine.Spy;

    beforeEach(() => {
      // spy on the blockQueryService so that setup subscription won't be called
      spyOn(component['blockQueryService'], 'subscribeToUpdate');
      // setup mock data for testing
      document = documentFactory.createDocument({ id, ownerId: uuidv4() });
      // setup spies
      getDocumentSpy = spyOn(component['documentQueryService'], 'getDocument$');
      getDocumentSpy.and.returnValue(getDocument$);
      setupSubscriptionSpy = spyOn<any>(component, 'setupBlockUpdateSubscription');
      component['retrieveDocumentData']();
    });

    it('should call getDocument$() with the id from route', done => {
      setTimeout(() => {
        expect(getDocumentSpy.calls.mostRecent().args[0]).toBe(id);
        done();
      }, 5);
    });

    it('should call setupBlockUpdateSubscription() when notified', done => {
      getDocument$.next(document);
      setTimeout(() => {
        expect(setupSubscriptionSpy.calls.count()).toBe(1);
        done();
      }, 3);
    });

    it('should store the document in currentDocument', done => {
      getDocument$.next(document);
      setTimeout(() => {
        expect(component['currentDocument']).toEqual(document);
        done();
      }, 3);
    });

    it('should change docTitle', done => {
      getDocument$.next(document);
      setTimeout(() => {
        expect(component['docTitle']).toEqual(document.title);
        done();
      }, 3);
    });

    it('should not do anything if document returned is null', done => {
      getDocument$.next(null);
      setTimeout(() => {
        expect(component['currentDocument']).toEqual(undefined);
        expect(setupSubscriptionSpy.calls.count()).toBe(0);
        done();
      }, 3);
    });

    it('should log the error received', done => {
      // Setup the spy on console
      const consoleSpy = spyOn(console, 'error');
      // setup the document to throw an error
      const mockError = new Error('test');
      getDocument$.error(mockError);
      const message = `DocumentPage failed to get document: ${mockError.message}`;
      expect(consoleSpy).toHaveBeenCalledWith(message);
      done();
    });
  });

  describe('addBlock()', () => {
    let blockQuerySpy: jasmine.Spy;
    let blockCommandSpy: jasmine.Spy;
    let documentCommandSpy: jasmine.Spy;
    const userId = uuidv4();

    beforeEach(() => {
      // setup mock data for the component
      component['currentDocument'] = documentFactory.createDocument(
        { id, ownerId: uuidv4() }
      );
      component['currentUser'] = {
        id: userId,
        firstName: 'foo',
        lastName: 'bar',
        email: 'foo@bar.com'
      };
      // setup the spies
      blockQuerySpy = spyOn(component['blockQueryService'], 'registerBlockCreatedByUI');
      blockCommandSpy = spyOn(component['blockCommandService'], 'createBlock');
      documentCommandSpy = spyOn(component['documentCommandService'], 'updateDocument');
    });

    it('should call registerBlockCreatedByUI()', async () => {
      await component.addBlock();
      expect(blockQuerySpy).toHaveBeenCalled();
    });

    it('should call BlockCommand to create a block', async () => {
      await component.addBlock();
      expect(blockCommandSpy).toHaveBeenCalled();
    });

    it('should update the list of block ids in the document', async () => {
      await component.addBlock();
      expect(component['currentDocument'].blockIds.length).toBe(1);
    });

    it('should update the version of the document to a new uuid', async () => {
      const oldVersion = component['currentDocument'].version;
      await component.addBlock();
      expect(isUuid(component['currentDocument'].version)).toBe(true);
      expect(component['currentDocument'].version).not.toEqual(oldVersion);
    });

    it('should update the lastUpdatedBy property', async () => {
      await component.addBlock();
      expect(component['currentDocument'].lastUpdatedBy).toEqual(userId);
    });

    it('should call to update document with the right argument', async () => {
      await component.addBlock();
      expect(documentCommandSpy).toHaveBeenCalledWith(component['currentDocument']);
    });

    it('should throw an error if unable to add block', async () => {
      // setup a random spy to throw an error
      const mockError = new Error('test');
      blockCommandSpy.and.returnValue(Promise.reject(mockError));
      try {
        await component.addBlock();
      } catch (error) {
        const message = `DocumentPage failed to add block: ${mockError.message}`;
        expect(error.message).toEqual(message);
      }
    });
  });

  describe('updateDocTitle()', () => {
    let spyUpdate: jasmine.Spy;
    let spyUpdateDocTitle: jasmine.Spy;

    let testId;
    let testTitle;

    beforeEach(() => {
      // TODO: Why wrap 'documentCommandService' with 'component'?
      // I think i didnt do that in service? what so special about compoent
      // TODO: all tests failed after setting up timeout
      testId = 'test id';
      testTitle = 'test title';
      spyUpdate = spyOn(component['documentCommandService'], 'updateDocument').and.returnValue(Promise.resolve('ok'));
      spyUpdateDocTitle = spyOn(component, 'updateDocTitle').and.callThrough();

      component['docTitle'] = testTitle;
      // is there a way no to mock this entire thing in order to pass codes like
      // currentDocument.blah?
      component['currentDocument'] = {
        id: testId,
        version: '',
        type: DocumentType.FORM,
        lastUpdatedBy: '',
        createdAt: '',
        updatedAt: '',
      } as Document;

      component['currentUser'] = { id: 'testUser' } as User;
    });

    it('should return a promise', () => {
      const data = component.updateDocTitle();
      expect(data instanceof Promise).toBeTruthy();
    });

    it('should call service updateDocument', async done => {
      component.updateDocTitle().then(() => {
        expect(spyUpdate.calls.count()).toBe(1);
        done();
      });
    });

    // TODO: the actual challenging part
    it('should send correct graphql query via service updateDocument', async done => {
      const expInput = {
        id: testId,
        version: '',
        lastUpdatedBy: '',
        title: component['docTitle'],
        updatedAt: '',
      };
      await component.updateDocTitle().then(() => {
        expect(spyUpdate.calls.mostRecent().args[0].id).toEqual(expInput.id);
        expect(spyUpdate.calls.mostRecent().args[0].title).toEqual(expInput.title);
        done();
      });
    });

    it('should not call updateDocument again for consecutive updates', done => {
      component.updateDocTitle();
      setTimeout(() => {
        component.updateDocTitle().then(() => {
          expect(spyUpdate).toHaveBeenCalledTimes(1);
          done();
        });
      }, 100);
    });

    it('should reject when failed', done => {
      const errMsg = 'test err';
      spyUpdate.and.returnValue(Promise.reject(new Error(errMsg)));
      component.updateDocTitle().catch(response => {
        expect(response.message).toEqual(errMsg);
        done();
      });
    });
  });

  describe('togglePlaceholder()', () => {

    let spyPlaceholderFlag: jasmine.Spy;
    let spyTitle: jasmine.Spy;

    beforeEach(() => {
      // spyTitle = spyOn<any>(component, 'docTitle');
      // spyPlaceholderFlag = spyOn<any>(component['documentCommandService'], 'isPlaceholderShown');
    });

    it('should change isPlaceholderShown to false when title is not empty', done => {
      component['docTitle'] = 'hello';
      component.togglePlaceholder();
      expect(component['isPlaceholderShown']).toBeFalsy();
      done();
    });

    it('should change isPlaceholderShown to true', done => {
      component['docTitle'] = '';
      component.togglePlaceholder();
      expect(component['isPlaceholderShown']).toBeTruthy();
      done();
    });
  });
});
