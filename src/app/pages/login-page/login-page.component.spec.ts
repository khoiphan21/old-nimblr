import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ServicesModule } from '../../modules/services.module';
import { BlankComponent } from '../../services/account/account-impl.service.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountServiceImpl } from '../../services/account/account-impl.service';
import { AccountService } from '../../services/account/account.service';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let accountService: AccountService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginPageComponent,
        BlankComponent
      ],
      imports: [
        ReactiveFormsModule,
        ServicesModule,
        MDBBootstrapModule.forRoot(),
        RouterTestingModule
      ],
      providers: [
        {
          provide: AccountService,
          useClass: AccountServiceImpl
        }
      ]
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
    it('should navigate to register page if the user have not verify the account', done => {
      const spy = spyOn(component['router'], 'navigate');
      const unverifiedEmail = component.loginForm.controls.email;
      const password = component.loginForm.controls.password;
      unverifiedEmail.setValue('p1356193@nwytg.net');
      password.setValue('Password1234');
      component.signIn().then(() => {
        fail('should not sign in successfully');
        done();
      }).catch(error => {
        expect(accountService.getUnverifiedUser()).toEqual({
          email: 'p1356193@nwytg.net', password: 'Password1234'
        });
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
