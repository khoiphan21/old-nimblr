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

const uuidv4 = require('uuid/v4');
// tslint:disable:no-string-literal
describe('NavigationBarComponent', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;
  let userFactory: UserFactoryService;
  let userId: UUID;

  // spies
  let getStatusSpy: jasmine.Spy;
  let getNavBarSpy: jasmine.Spy;
  let accountSpy: jasmine.Spy;

  let navigationBar$: BehaviorSubject<any>;

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
    navigationBar$ = new BehaviorSubject([]);
    getStatusSpy = spyOn(component['navigationBarService'], 'getNavigationBarStatus$');
    getStatusSpy.and.returnValue(new BehaviorSubject(true));
    getNavBarSpy = spyOn(component['navigationBarService'], 'getNavigationBar$');
    getNavBarSpy.and.returnValue(navigationBar$);
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

  describe('ngOnInit', () => {
    let user;

    beforeEach(() => {
      user = userFactory.createUser('user1', 'john', 'doe', 'johndoe@gmail.com');
      accountSpy.and.returnValue(new BehaviorSubject(user));
      spyOn<any>(component, 'processInitialName');
    });

    it('should set the user to the returned value', () => {
      component.ngOnInit();
      expect(component.currentUser).toEqual(user);
    });

    it('should process user`s first name when there is value', () => {
      component.ngOnInit();
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

  it('should receive get the right value for the navigationTabs when the data comes in', () => {
    const tab1 = new NavigationTabDocument({
      id: 'tab1', title: 'nav tab 1', type: DocumentType.GENERIC, children: []
    });
    const tab2 = new NavigationTabDocument({
      id: 'tab2', title: 'nav tab 2', type: DocumentType.GENERIC, children: []
    });
    const expectedResult = [tab1, tab2];
    getNavBarSpy.and.returnValue(new BehaviorSubject(expectedResult));
    component.ngOnInit();
    expect(component.navigationTabs).toEqual(expectedResult);
  });

  describe('createNewDocument()', () => {
    let routerSpy: jasmine.Spy;
    let commandService: jasmine.Spy;
    const id = 'abcde';

    beforeEach(() => {
      routerSpy = spyOn(component['router'], 'navigate');
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
});
