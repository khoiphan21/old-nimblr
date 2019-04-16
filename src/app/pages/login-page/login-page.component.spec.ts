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
      component.loginForm.controls.email.setValue(email);
      component.loginForm.controls.password.setValue(password);
    });

    it('should stop the function if the data returned is empty', done => {
      spyOn(component['accountService'], 'login').and.returnValue(Promise.resolve(null));
      component.signIn().then(() => {
        fail('should not proceed signIn()');
        done();
      }).catch(() => {
        const navigationCalls = navigationSpy.calls.count.length;
        expect(navigationCalls).toBe(0);
        done();
      });
    });

    it('should navigate to register page if the account is not verified', done => {
      spyOn(component['accountService'], 'login').and.returnValue(Promise.reject({
        code: 'UserNotConfirmedException'
      }));
      component.signIn().then(() => {
        fail('should not sign in successfully');
        done();
      }).catch(() => {
        const navigatedPath = navigationSpy.calls.mostRecent().args[0][0];
        expect(navigatedPath).toBe('register');
        done();
      });
    });

    it('should set the loginError to USER_NOT_FOUND', done => {
      spyOn(component['accountService'], 'login').and.returnValue(Promise.reject({
        code: 'UserNotFoundException'
      }));
      component.signIn().then(() => {
        fail('should not sign in successfully');
        done();
      }).catch(() => {
        expect(component.errorMessage).toBe(LoginError.USER_NOT_FOUND);
        done();
      });
    });


    it('should set the loginError to INCORRECT_PASSWORD', done => {
      spyOn(component['accountService'], 'login').and.returnValue(Promise.reject({
        code: 'NotAuthorizedException'
      }));
      component.signIn().then(() => {
        fail('should not sign in successfully');
        done();
      }).catch(() => {
        expect(component.errorMessage).toBe(LoginError.INCORRECT_PASSWORD);
        done();
      });
    });

    it('should console the error if the error is not specified yet', done => {
      spyOn(component['accountService'], 'login').and.returnValue(Promise.reject({
        code: 'IncorrectPasswordException'
      }));
      component.signIn().then(() => {
        fail('should not sign in successfully');
        done();
      }).catch(() => {
        expect(console.error).toHaveBeenCalled();
        done();
      });
    });

    it('should navigate to dashboard page if the user have verified the account', done => {
      const accountServiceSpy = spyOn(component['accountService'], 'login')
        .and.returnValues(Promise.resolve({ id: 'abcd' }));
      component.signIn().then(() => {
        expect(accountServiceSpy.calls.count()).toBe(1);
        const navigatedPath = navigationSpy.calls.mostRecent().args[0][0];
        expect(navigatedPath).toBe('dashboard');
        done();
      }).catch(error => {
        fail('should not fail to sign in');
        done();
      });
    });
  });
});
