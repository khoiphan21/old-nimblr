import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AccountService } from '../../services/account/account.service';
import { MockAccountService } from '../../services/account/account-impl.service.spec';
import { UserFactoryService } from '../../services/user/user-factory.service';
import { HeaderOptionsComponent } from './header-options/header-options.component';
import { DocumentService } from 'src/app/services/document/document.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userFactory: UserFactoryService;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        HeaderOptionsComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        DocumentService,
        {
          provide: AccountService,
          useClass: MockAccountService
        }
      ]
    });
});

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    userFactory = TestBed.get(UserFactoryService);
    component = fixture.componentInstance;
    component.currentUser = userFactory.createUser('id', 'firstName', 'lastName', 'email');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* tslint:disable:no-string-literal */
  describe('ngOnInit', () => {
    let user;
    beforeEach(() => {
      user = userFactory.createUser('user1', 'john', 'doe', 'johndoe@gmail.com');
      spyOn(component['accountService'], 'getUser$').and.callFake(() => {
        return new BehaviorSubject(user);
      });
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

  it('showNavigationBar() - should call setNavigationBarStatus() from the service', () => {
    spyOn(component['navigationBarService'], 'setNavigationBarStatus');
    component.showNavigationBar();
    expect(component['navigationBarService'].setNavigationBarStatus).toHaveBeenCalled();
  });

  describe('manageHeaderContent should set `currentUrl` to the right value', () => {
    it('when url is dashboard', () => {
      component['manageHeaderContent']('/dashboard');
      expect(component.currentUrl).toBe('dashboard');
    });

    it('when url is not dashboard', () => {
      component['manageHeaderContent']('/document');
      expect(component.currentUrl).toBe('document');
    });
  });
});
