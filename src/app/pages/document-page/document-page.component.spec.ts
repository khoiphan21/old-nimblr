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
import { Subject, BehaviorSubject, UnsubscriptionError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DocumentFactoryService } from 'src/app/services/document/factory/document-factory.service';
import { Document } from 'src/app/classes/document';
import { isUuid } from 'src/app/classes/helpers';
import { DocumentType, SharingStatus, BlockType } from 'src/API';
import { TextBlock } from "src/app/classes/block/textBlock";
import { UserFactoryService } from 'src/app/services/user/user-factory.service';
import { QuestionBlock } from 'src/app/classes/block/question-block';

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

  describe('addNewBlock()', () => {
    let block: any;
    let document: Document;
    let user: User;
    let userFactory: UserFactoryService;
    let blockQuerySpy: jasmine.Spy;
    let blockCommandSpy: jasmine.Spy;
    let documentCommandSpy: jasmine.Spy;

    beforeEach(() => {
      userFactory = TestBed.get(UserFactoryService);

      // create mock data for testing
      document = documentFactory.createDocument({
        id: uuidv4(),
        ownerId: uuidv4()
      });
      user = userFactory.createUser(
        uuidv4(), 'first', 'last', 'email'
      );

      // Set the component's data to the mock data
      component.currentDocument = document;
      component['currentUser'] = user;
      component.blockIds = [];

      // Setup all the spies
      blockQuerySpy = spyOn(component['blockQueryService'], 'registerBlockCreatedByUI');

      blockCommandSpy = spyOn(component['blockCommandService'], 'createBlock');
      blockCommandSpy.and.returnValue(Promise.resolve());

      documentCommandSpy = spyOn(component['documentCommandService'], 'updateDocument');
      documentCommandSpy.and.returnValue(Promise.resolve());
    });

    it('should throw an error if the block type is not supported', async () => {
      const type: any = 'abc';
      const message = `Error: BlockType "${type}" is not supported`;
      try {
        await component.addNewBlock(type);
        fail('error must occur');
      } catch (error) {
        expect(error.message).toEqual(`DocumentPage failed to add block: ${message}`);
      }
    })

    function testInteractionWithOtherClasses() {
      it('should register the created block to the BlockQueryService', () => {
        expect(blockQuerySpy).toHaveBeenCalledWith(block);
      });
      it('should call to create a new block to GraphQL', () => {
        expect(blockCommandSpy).toHaveBeenCalledWith(block);
      });
      it('should add the new block ID to the list to be shown in the UI', () => {
        expect(component.blockIds[0]).toEqual(block.id);
      });
      it('should call DocumentCommandService to update document', () => {
        const expectedArgs = {
          id: document.id,
          lastUpdatedBy: user.id,
          blockIds: [block.id]
        };
        expect(documentCommandSpy).toHaveBeenCalledWith(expectedArgs);
      });
    }

    function testGenericErrorPaths() {
      it('should throw the error raised by BlockCommandService', async () => {
        const message = 'test';
        blockCommandSpy.and.returnValue(Promise.reject(message));
        try {
          await component.addNewBlock(BlockType.TEXT);
          fail('error must occur');
        } catch (error) {
          expect(error.message).toEqual(`DocumentPage failed to add block: ${message}`);
        }
      });

      it('should throw the error raised by DocumentCommandService', async () => {
        const message = 'test';
        documentCommandSpy.and.returnValue(Promise.reject(message));
        try {
          await component.addNewBlock(BlockType.TEXT);
          fail('error must occur');
        } catch (error) {
          expect(error.message).toEqual(`DocumentPage failed to add block: ${message}`);
        }
      });
    }

    describe('adding new TextBlock', () => {

      beforeEach(async () => {
        block = await component.addNewBlock(BlockType.TEXT);
      });

      describe('[HAPPY PATH]', () => {
        it('should resolve a TextBlock if successful', () => {
          expect(block instanceof TextBlock).toBe(true);
          // No need to check for any other values, as they are checked in the
          // TextBlock class and the factory already
        });
        testInteractionWithOtherClasses();
      });

      describe('[ERROR PATHS]', () => {
        it('should throw the error from factory', async () => {
          const error = Error('test');
          spyOn(component['blockFactoryService'], 'createNewTextBlock')
            .and.throwError(error.message);
          try {
            await component.addNewBlock(BlockType.TEXT);
            fail('error must occur');
          } catch (thrownError) {
            expect(thrownError.message).toEqual(`DocumentPage failed to add block: ${error}`);
          }
        });

        testGenericErrorPaths();
      });

    });

    describe('adding new QuestionBlock', () => {

      beforeEach(async () => {
        block = await component.addNewBlock(BlockType.QUESTION);
      });

      describe('[HAPPY PATH]', () => {
        it('should resolve a QuestionBlock if successful', () => {
          expect(block instanceof QuestionBlock).toBe(true);
          // No need to check for any other values, as they are checked in the
          // TextBlock class and the factory already
        });
        testInteractionWithOtherClasses();
      });

      describe('[ERROR PATHS]', () => {
        it('should throw the error from factory', async () => {
          const error = Error('test');
          spyOn(component['blockFactoryService'], 'createNewQuestionBlock')
            .and.throwError(error.message);
          try {
            await component.addNewBlock(BlockType.QUESTION);
            fail('error must occur');
          } catch (thrownError) {
            expect(thrownError.message).toEqual(`DocumentPage failed to add block: ${error}`);
          }
        });

        testGenericErrorPaths();
      });

    });

    describe('adding block after another block', () => {
      const existingBlockId1 = uuidv4();
      const afterId = uuidv4();
      const existingBlockId2 = uuidv4();
      const existingBlockId3 = uuidv4();

      let expectedIndex: number;
      beforeEach(() => {
        component.blockIds = [
          existingBlockId1,
          existingBlockId2,
          afterId,
          existingBlockId3,
        ];

        // Store the expected index first
        expectedIndex = component.blockIds.indexOf(afterId) + 1;
      });

      describe('checking order', () => {
        beforeEach(async () => {
          // now then call to add new block
          block = await component.addNewBlock(BlockType.TEXT, afterId);
        });

        it('should have the right order of blockIds in the document', () => {
          expect(component.blockIds[expectedIndex]).toEqual(block.id);
        });

        it('should keep the other ids in place', () => {
          expect(component.blockIds[0]).toEqual(existingBlockId1);
          expect(component.blockIds[1]).toEqual(existingBlockId2);
          expect(component.blockIds[2]).toEqual(afterId);
          expect(component.blockIds[4]).toEqual(existingBlockId3);
        });
      });

      describe('invalid "after" param', () => {
        it('should add to the end if the given index is null', async () => {
          const index = null;
          block = await component.addNewBlock(BlockType.TEXT, index);
          expect(component.blockIds[4]).toEqual(block.id);
        });
        it('should add to the end if the given index is undefined', async () => {
          const index = undefined;
          block = await component.addNewBlock(BlockType.TEXT, index);
          expect(component.blockIds[4]).toEqual(block.id);
        });
        it('should add to the end if the given index does not exist', async () => {
          const index = 'abcd';
          block = await component.addNewBlock(BlockType.TEXT, index);
          expect(component.blockIds[4]).toEqual(block.id);
        });
      });

    });
  });

  describe('updateDocTitle()', () => {
    let spyUpdate: jasmine.Spy;
    let spyUpdateDocTitle: jasmine.Spy;

    let testId;
    let userId;
    let testTitle;

    beforeEach(() => {
      // TODO: Why wrap 'documentCommandService' with 'component'?
      // I think i didnt do that in service? what so special about compoent
      // TODO: all tests failed after setting up timeout
      testId = uuidv4();
      userId = uuidv4();
      testTitle = 'test title';
      spyUpdateDocTitle = spyOn(component, 'updateDocTitle').and.callThrough();
      spyUpdate = spyOn(component['documentCommandService'], 'updateDocument'); spyUpdate.and.returnValue(Promise.resolve('ok'));

      component['docTitle'] = testTitle;
      // is there a way no to mock this entire thing in order to pass codes like
      // currentDocument.blah?
      component['currentDocument'] = {
        id: testId,
        version: uuidv4(),
        type: DocumentType.GENERIC,
        lastUpdatedBy: uuidv4(),
        createdAt: '',
        updatedAt: '',
      } as Document;

      component['currentUser'] = { id: userId } as User;
    });

    it('should call service updateDocument', async () => {
      await component.updateDocTitle(0);
      expect(spyUpdate.calls.count()).toBe(1);
    });

    // TODO: the actual challenging part
    it('should send correct graphql query via service updateDocument', async () => {
      const expInput = {
        id: testId,
        title: component['docTitle']
      };
      await component.updateDocTitle(0);
      expect(spyUpdate.calls.mostRecent().args[0].id).toEqual(expInput.id);
      expect(spyUpdate.calls.mostRecent().args[0].title).toEqual(expInput.title);
    });

    it('should not call updateDocument again for consecutive updates', done => {
      component.updateDocTitle(50);
      component.updateDocTitle().then(() => {
        expect(spyUpdate).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should reject when failed', done => {
      const errMsg = 'test err';
      spyOn(console, 'error'); // shouldn't log the error out!
      spyUpdate.and.returnValue(Promise.reject(errMsg));
      component.updateDocTitle(0).then(() => {
        fail();
      }).catch(err => {
        expect(err).toEqual(errMsg);
        done();
      });
    });
  });

  describe('changeSharingStatus()', () => {
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = spyOn(component['documentCommandService'], 'updateDocument');
      component.currentDocument = documentFactory.createDocument({ id, ownerId: uuidv4() });
    });

    it('should set the current status to the new status', () => {
      component.changeSharingStatus(SharingStatus.PUBLIC);
      expect(component.currentSharingStatus).toEqual(SharingStatus.PUBLIC);
      component.changeSharingStatus(SharingStatus.PRIVATE);
      expect(component.currentSharingStatus).toEqual(SharingStatus.PRIVATE);
    });
    it('should call the documentCommandService with the right args', () => {
      const status = SharingStatus.PUBLIC;
      component.changeSharingStatus(status);
      expect(spy.calls.mostRecent().args[0].sharingStatus).toEqual(status);
    });
  });
});
