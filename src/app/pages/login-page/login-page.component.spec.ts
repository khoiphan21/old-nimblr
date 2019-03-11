import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountService } from '../../services/account/account.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockAccountService } from 'src/app/services/account/account-impl.service.spec';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let accountService: AccountService;
  beforeEach(async(() => {
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
    })
      .compileComponents();
  }));

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

  describe('signIn()', () => {

    /* tslint:disable:no-string-literal */
    it('should navigate to register page if the account is not verified', done => {
      // spy on the router
      const spy = spyOn(component['router'], 'navigate');
      // spy on the accountService
      spyOn(component['accountService'], 'login').and.returnValue(Promise.reject({
        code: 'UserNotConfirmedException'
      }));

      // Set the email and password for testing
      const email = 'abcd@email.com';
      const password = 'PAssword1234';
      component.loginForm.controls.email.setValue(email);
      component.loginForm.controls.password.setValue(password);
      // Now try to sign in
      component.signIn().then(() => {
        fail('should not sign in successfully');
        done();
      }).catch(() => {
        const navigatedPath = spy.calls.mostRecent().args[0][0];
        expect(navigatedPath).toBe('register');
        done();
      });
    });

    /* tslint:disable:no-string-literal */
    it('should navigate to register page if the user have verified the account', done => {
      const spy = spyOn(component['router'], 'navigate');
      const accountServiceSpy = spyOn(component['accountService'], 'login')
        .and.returnValues(Promise.resolve({ id: 'abcd' }));

      component.signIn().then(() => {
        expect(accountServiceSpy.calls.count()).toBe(1);
        const navigatedPath = spy.calls.mostRecent().args[0][0];
        expect(navigatedPath).toBe('dashboard');
        done();
      }).catch(error => {
        fail('should not fail to sign in');
        console.error(error);
        done();
      });
    });
  });
});
