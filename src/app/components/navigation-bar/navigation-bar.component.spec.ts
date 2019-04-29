import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationBarComponent } from './navigation-bar.component';
import { NavigationTabComponent } from './navigation-tab/navigation-tab.component';
import { ServicesModule } from 'src/app/modules/services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { NavigationTabDocument } from 'src/app/classes/navigation-tab';
import { configureTestSuite } from 'ng-bullet';
import { AccountService } from 'src/app/services/account/account.service';
import { MockAccountService } from 'src/app/services/account/account-impl.service.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserFactoryService } from 'src/app/services/user/user-factory.service';
import { ResponsiveModule } from 'ngx-responsive';
import { DocumentType, CreateDocumentInput, SharingStatus } from '../../../API';
import { isUuid } from '../../classes/helpers';
import { UUID } from '../../services/document/command/document-command.service';
import { NavigationEnd, ActivatedRoute } from '@angular/router';

const uuidv4 = require('uuid/v4');
// tslint:disable:no-string-literal
describe('NavigationBarComponent', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;
  let userFactory: UserFactoryService;
  let userId: UUID;
  let routerSpy: jasmine.Spy;
  const documentId = 'test123';
  // spies
  let getStatusSpy: jasmine.Spy;
  let getNavBarSpy: jasmine.Spy;
  let navBar$: Subject<any>;
  let accountSpy: jasmine.Spy;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavigationBarComponent,
        NavigationTabComponent
      ],
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([]),
        ResponsiveModule.forRoot()
      ],
      providers: [
        {
          provide: AccountService,
          useClass: MockAccountService
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => documentId
              }
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationBarComponent);
    userFactory = TestBed.get(UserFactoryService);
    component = fixture.componentInstance;
    // Setup spies
    routerSpy = spyOn(component['router'], 'navigate');
    getStatusSpy = spyOn(component['navigationBarService'], 'getNavigationBarStatus$');
    getStatusSpy.and.returnValue(new BehaviorSubject(true));
    getNavBarSpy = spyOn(component['navigationBarService'], 'getNavigationBar$');
    navBar$ = new Subject();
    getNavBarSpy.and.returnValue(navBar$);
    accountSpy = spyOn(component['accountService'], 'getUser$');
    accountSpy.and.returnValue(new BehaviorSubject(null));

    // Setup component
    component.currentUser = userFactory.createUser('id', 'firstName', 'lastName', 'email');
    component.navigationTabs = [];
    userId = uuidv4();
    spyOn(component['accountService'], 'isUserReady').and.returnValue(
      Promise.resolve({ id: userId })
    );

    // call to render
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    let navigationStatusSpy: jasmine.Spy;
    let userSpy: jasmine.Spy;
    let navigationBarSpy: jasmine.Spy;
    let documentStrucutureSpy: jasmine.Spy;

    beforeEach(async () => {
      navigationStatusSpy = spyOn<any>(component, 'setupNavigationStatus');
      userSpy = spyOn<any>(component, 'setupUser');
      userSpy.and.returnValue(Promise.resolve());
      navigationBarSpy = spyOn<any>(component, 'setupNavigationBar');
      documentStrucutureSpy = spyOn<any>(component, 'setupDocumentStructure');
      navigationBarSpy.and.returnValue(Promise.resolve());
      await component.ngOnInit();
    });

    it('should call setupNavigationStatus()', async () => {
      expect(navigationStatusSpy).toHaveBeenCalled();
    });

    it('should call setupUser()', async () => {
      expect(userSpy).toHaveBeenCalled();
    });

    it('should call setupNavigationBar()', async () => {
      expect(navigationBarSpy).toHaveBeenCalled();
    });

    it('should call setupDocumentStructure()', async () => {
      expect(documentStrucutureSpy).toHaveBeenCalled();
    });
  });

  it('processInitialName() - should process user`s first name when there is value',  () => {
    component['processInitialName']('John');
    expect(component.initialName).toEqual('J');
  });

  describe('setupUser()', () => {
    let user;

    beforeEach(() => {
      user = userFactory.createUser('user1', 'john', 'doe', 'johndoe@gmail.com');
      accountSpy.and.returnValue(new BehaviorSubject(user));
      spyOn<any>(component, 'processInitialName');
    });

    it('should set the user to the returned value', () => {
      component['setupUser']();
      expect(component.currentUser).toEqual(user);
    });

    it('should call processInitialName()', () => {
      component['setupUser']();
      expect(component['processInitialName']).toHaveBeenCalled();
    });

  });

  /* tslint:disable:no-string-literal */
  it('processInitialName() - should get the first letter of the name', () => {
    const firstName = 'Judy';
    component['processInitialName'](firstName);
    expect(component.initialName).toBe(firstName.charAt(0));
  });

  it('should receive get the right value for the navigation bar status', () => {
    const expectedResult = false;
    getStatusSpy.and.returnValue(new BehaviorSubject(expectedResult));
    getNavBarSpy.and.returnValue(new Subject());
    component.ngOnInit();
    expect(component.isNavigationTabShown).toEqual(expectedResult);
  });

  describe('setupNavigationBar()', () => {
    it('should receive the right value for the navigationTabs when the data comes in', () => {
      const tab1 = new NavigationTabDocument({
        id: 'tab1', title: 'nav tab 1', type: DocumentType.GENERIC, children: []
      });
      const tab2 = new NavigationTabDocument({
        id: 'tab2', title: 'nav tab 2', type: DocumentType.GENERIC, children: []
      });
      const expectedResult = [tab1, tab2];
      getNavBarSpy.and.returnValue(new BehaviorSubject(expectedResult));
      component['setupNavigationBar']();
      expect(component.navigationTabs).toEqual(expectedResult);
    });
  });

  describe('createNewDocument()', () => {
    let commandService: jasmine.Spy;
    const id = 'abcde';

    beforeEach(() => {
      commandService = spyOn(component['documentCommandService'], 'createDocument');
      commandService.and.returnValue({ id });
    });

    describe('calls to createDocument()', () => {
      let args: CreateDocumentInput;
      beforeEach(async () => {
        await component.createNewDocument();
        args = commandService.calls.mostRecent().args[0];
      });
      it('should call createDocument() from Document Service', async () => {
        expect(commandService).toHaveBeenCalled();
      });
      it('should call with a uuid version', async () => {
        expect(isUuid(args.version)).toBe(true);
      });
      it('should call with a GENERIC type', async () => {
        expect(args.type).toBe(DocumentType.GENERIC);
      });
      it('should call with the right ownerId', async () => {
        expect(args.ownerId).toBe(userId);
      });
      it('should call with the right lastUpdatedBy', async () => {
        expect(args.lastUpdatedBy).toBe(userId);
      });
      it('should call with PRIVATE sharing status', async () => {
        expect(args.sharingStatus).toBe(SharingStatus.PRIVATE);
      });
    });

    it('should navigate to the right "document" page when done', async () => {
      await component.createNewDocument();
      expect(routerSpy).toHaveBeenCalledWith([`/document/abcde`]);
    });
  });

  describe('setupDocumentStructure()', () => {
    let getStructureSpy: jasmine.Spy;
    beforeEach(() => {
      getStructureSpy = spyOn<any>(component, 'getStructure');
    });

    it('should call getStructure() once', () => {
      component['setupDocumentStructure']();
      expect(getStructureSpy).toHaveBeenCalledTimes(1);
    });

    it('should call getStructure() twice', () => {
      const navigationEnd = new NavigationEnd(0, '', '/document');
      const mockRouter: any = {
        events: new BehaviorSubject(navigationEnd)
      };
      component['router'] = mockRouter;
      component['setupDocumentStructure']();
      expect(getStructureSpy).toHaveBeenCalledTimes(2);
    });

  });

  describe('getStructure()', () => {
    let getDocumentSpy: jasmine.Spy;
    const blockIds = ['test123'];
    const mockDocument = {
      blockIds
    };
    beforeEach(() => {
      getDocumentSpy = spyOn(component['documentQueryService'], 'getDocument$').and.returnValue(new BehaviorSubject(mockDocument));
    });

    it('should update into the latest value when respond', async () => {
      component['getStructure']();
      expect(component.blockIds).toEqual(blockIds);
    });
  });

});
