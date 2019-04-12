import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MockAccountService } from 'src/app/services/account/account-impl.service.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { configureTestSuite } from 'ng-bullet';
import { User } from 'src/app/classes/user';
import { Subject, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentFactoryService } from 'src/app/services/document/factory/document-factory.service';
import { Document } from 'src/app/classes/document';
import { DocumentType, SharingStatus, BlockType, TextBlockType } from 'src/API';
import { DocumentContentComponent } from './document-content.component';
import { ServicesModule } from 'src/app/modules/services.module';
import { AccountService } from 'src/app/services/account/account.service';
import { QuestionBlock } from 'src/app/classes/block/question-block';
import { TextBlock } from 'src/app/classes/block/textBlock';
import { UserFactoryService } from 'src/app/services/user/user-factory.service';
import { CreateBlockInfo } from 'src/app/components/block/block-option/block-option.component';

const uuidv4 = require('uuid/v4');

describe('DocumentContentComponent', () => {
  let component: DocumentContentComponent;
  let fixture: ComponentFixture<DocumentContentComponent>;
  let documentFactory: DocumentFactoryService;
  let router;
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
        DocumentContentComponent,
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
        },
        {
          provide: Router,
          useValue: {
            url: '/document'
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentContentComponent);
    router = TestBed.get(Router);
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

  describe('checkIsChildDocument', () => {
    const uuid = 'd232cdb5-142d-4d77-afb3-8ac638f9755b';
    const uuid2 = 't412awf9-142d-4d77-afb3-8ac638f9755c';

    it('should set value to true if it is a child document', () => {
      router.url = `/document/${uuid}/${uuid2}`;
      component['checkIsChildDocument']();
      expect(component.isChildDoc).toBe(true);
    });

    it('should set value to false if it is not a child document', () => {
      component.isChildDoc = true;
      router.url = `/document/${uuid}`;
      component['checkIsChildDocument']();
      expect(component.isChildDoc).toBe(false);
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

    const mockBlockInfo: CreateBlockInfo = {
      type: BlockType.TEXT,
    };

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
      const blockInfo = {
        type: null,
        textblocktype: null,
      } as CreateBlockInfo;
      const message = `Error: BlockType "${blockInfo.type}" is not supported`;
      try {
        await component.addNewBlock(blockInfo);
        fail('error must occur');
      } catch (error) {
        expect(error.message).toEqual(`DocumentPage failed to add block: ${message}`);
      }
    });

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
          await component.addNewBlock(mockBlockInfo);
          fail('error must occur');
        } catch (error) {
          expect(error.message).toEqual(`DocumentPage failed to add block: ${message}`);
        }
      });

      it('should throw the error raised by DocumentCommandService', async () => {
        const message = 'test';
        documentCommandSpy.and.returnValue(Promise.reject(message));
        try {
          await component.addNewBlock(mockBlockInfo);
          fail('error must occur');
        } catch (error) {
          expect(error.message).toEqual(`DocumentPage failed to add block: ${message}`);
        }
      });
    }

    describe('adding new TextBlock', () => {

      beforeEach(async () => {
        block = await component.addNewBlock(mockBlockInfo);
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
            await component.addNewBlock(mockBlockInfo);
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
        mockBlockInfo.type = BlockType.QUESTION;
        block = await component.addNewBlock(mockBlockInfo);
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
            await component.addNewBlock(mockBlockInfo);
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
          block = await component.addNewBlock(mockBlockInfo, afterId);
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
          block = await component.addNewBlock(mockBlockInfo, index);
          expect(component.blockIds[4]).toEqual(block.id);
        });
        it('should add to the end if the given index is undefined', async () => {
          const index = undefined;
          block = await component.addNewBlock(mockBlockInfo, index);
          expect(component.blockIds[4]).toEqual(block.id);
        });
        it('should add to the end if the given index does not exist', async () => {
          const index = 'abcd';
          block = await component.addNewBlock(mockBlockInfo, index);
          expect(component.blockIds[4]).toEqual(block.id);
        });
      });

    });
  });

  describe('updateDocTitle()', () => {
    let spyUpdate: jasmine.Spy;
    let spyDocCommandServiceTitle: jasmine.Spy;

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
      spyDocCommandServiceTitle = spyOn(component, 'updateDocTitle').and.callThrough();
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

  it('showInviteCollaborator() - should set `isInviteCollaboratorShown` to true', () => {
    component.showInviteCollaborator();
    expect(component.isInviteCollaboratorShown).toBe(true);
  });

  it('showSendForm() - should set `isSendFormShown` to true', () => {
    component.showSendForm();
    expect(component.isSendFormShown).toBe(true);
  });

  it('navigateToChildDocument() - should send the right argument', done => {
    component['currentDocument'] = documentFactory.createDocument(
      { id, ownerId: uuidv4() }
    );
    const uuid = 'd232cdb5-142d-4d77-afb3-8ac638f9755b';
    component.navigateToChildDocEvent.subscribe(data => {
      expect(data).toEqual({
        parent: component.currentDocument.id,
        child: uuid
      });
      done();
    });
    component.navigateToChildDocument(uuid);
  });

  describe('backToParent()', () => {
    let locationSpy;
    beforeEach(() => {
      locationSpy = spyOn(component['location'], 'back').and.callFake(() => {
        return;
      });
    });

    it('should navigate to the previous url when it is a child document', () => {
      component.isChildDoc = true;
      component.backToParent();
      expect(locationSpy).toHaveBeenCalled();
    });

    it('should not navigate to the previous url when it is not a child document', () => {
      component.isChildDoc = false;
      component.backToParent();
      expect(locationSpy).not.toHaveBeenCalled();
    });
  });

  describe('deleteBlock', () => {
    let spyBlockCommandService: jasmine.Spy;
    let spyDocCommandService: jasmine.Spy;
    let spyBlockQueryService: jasmine.Spy;

    let mockCurrentDocument: object;
    let testId: string;

    beforeEach(() => {
      spyBlockQueryService = spyOn(component['blockQueryService'], 'registerBlockDeletedByUI').and.returnValue(Promise.resolve('test'));
      spyDocCommandService = spyOn(component['documentCommandService'], 'updateDocument').and.returnValue(Promise.resolve('test'));
      spyBlockCommandService = spyOn(component['blockCommandService'], 'deleteBlock').and.returnValue(Promise.resolve('test'));
      const blockIds = ['t1', 't2', 't3'];
      mockCurrentDocument = {
        blockIds,
        version: 'v1',
        lastUpdatedBy: '',
      };
      component['currentDocument'] = mockCurrentDocument as Document;
      component.blockIds = blockIds;
      component['currentUser'] = { id: '' } as User;

      testId = 't1';
    });

    it('should call registerBlockDeletedByUI service', () => {
      component.deleteBlock(testId);
      expect(spyBlockQueryService).toHaveBeenCalled();
    });

    it('should call registerBlockDeletedByUI service with correct value', () => {
      component.deleteBlock(testId);
      expect(spyBlockQueryService).toHaveBeenCalledWith(testId);
    });

    it('should call updateDocument command service', () => {
      component.deleteBlock(testId);
      expect(spyDocCommandService).toHaveBeenCalled();
    });

    it('should call deleteBlock command service', () => {
      component.deleteBlock(testId);
      expect(spyBlockCommandService).toHaveBeenCalled();
    });

    it('should call deleteBlock service with correct value', () => {
      const expectedInput = { id: testId };
      component['block.id'] = testId;
      component.deleteBlock(testId);
      expect(spyBlockCommandService).toHaveBeenCalledWith(expectedInput);
    });

    it('should throw error when docCommandService.updateDoc fails', done => {
      const expectedError = 'test err';
      spyDocCommandService.and.returnValue(Promise.reject(new Error(expectedError)));
      component.deleteBlock(testId).catch(err => {
        expect(err.message).toEqual(`DocumentPage failed to delete block: ${expectedError}`);
        done();
      });
    });

    it('should throw error when blockCommandService.deleteBlock fails', done => {
      const expectedError = 'test err';
      spyBlockCommandService.and.returnValue(Promise.reject(new Error(expectedError)));
      component.deleteBlock(testId).catch(err => {
        expect(err.message).toEqual(`DocumentPage failed to delete block: ${expectedError}`);
        done();
      });
    });

    it('should remove correct id from currentDocument', async () => {
      await component.deleteBlock(testId);
      expect(component['currentDocument'].blockIds.includes('t1')).toBeFalsy();
    });
  });

});
