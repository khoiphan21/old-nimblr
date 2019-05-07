import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent, LoginError } from './login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountService } from '../../services/account/account.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockAccountService } from 'src/app/services/account/account-impl.service.spec';
import { configureTestSuite } from 'ng-bullet';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let accountService: AccountService;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginPageComponent
      ],
      imports: [
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        RouterTestingModule
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
    fixture = TestBed.createComponent(LoginPageComponent);
    accountService = TestBed.get(AccountService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should toggle the password status', () => {
    expect(component.passwordType).toBe('password');
    component.togglePassword();
    expect(component.passwordType).toBe('text');
    component.togglePassword();
    expect(component.passwordType).toBe('password');
  });

  /* tslint:disable:no-string-literal */
  describe('signIn()', () => {
    let navigationSpy;
    const email = 'abcd@email.com';
    const password = 'PAssword1234';
    beforeEach(() => {
      navigationSpy = spyOn(component['router'], 'navigate');
      spyOn(console, 'error');
      component.buildForm();
      component.loginForm.controls.email.setValue(email);
      component.loginForm.controls.password.setValue(password);
    });

    it('should navigate to register page if the account is not verified', async () => {
      spyOn(component['accountService'], 'login').and.returnValue(Promise.reject({
        code: 'UserNotConfirmedException'
      }));
      await component.signIn();
      const navigatedPath = navigationSpy.calls.mostRecent().args[0][0];
      expect(navigatedPath).toBe('register');
    });

    it('should set the loginError to USER_NOT_FOUND', async () => {
      spyOn(component['accountService'], 'login').and.returnValue(Promise.reject({
        code: 'UserNotFoundException'
      }));
      await component.signIn();
      expect(component.errorMessage).toBe(LoginError.USER_NOT_FOUND);
    });


    it('should set the loginError to INCORRECT_PASSWORD', async () => {
      spyOn(component['accountService'], 'login').and.returnValue(Promise.reject({
        code: 'NotAuthorizedException'
      }));
      await component.signIn();
      expect(component.errorMessage).toBe(LoginError.INCORRECT_PASSWORD);
    });

    it('should console the error if the error is not specified yet', async () => {
      spyOn(component['accountService'], 'login').and.returnValue(Promise.reject({
        code: 'IncorrectPasswordException'
      }));
      await component.signIn();
      expect(console.error).toHaveBeenCalled();
    });

    it('should navigate to the wildcard page if the user have verified the account', async () => {
      const accountServiceSpy = spyOn(component['accountService'], 'login')
        .and.returnValues(Promise.resolve({ id: 'abcd' }));
      await component.signIn();
      expect(accountServiceSpy.calls.count()).toBe(1);
      const navigatedPath = navigationSpy.calls.mostRecent().args[0][0];
      expect(navigatedPath).toBe('/document/undefined');
    });
  });
});
