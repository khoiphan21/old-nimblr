import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPageComponent } from './register-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ServicesModule } from '../../modules/services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountService } from '../../services/account/account.service';
import { AccountServiceImpl } from '../../services/account/account-impl.service';
import { BlankComponent, TEST_USERNAME, TEST_PASSWORD } from '../../services/account/account-impl.service.spec';
import { processTestError } from '../../classes/helpers';

const uuidv4 = require('uuid/v4');

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;
  let accountService: AccountService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegisterPageComponent,
        BlankComponent
      ],
      imports: [
        ServicesModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'dashboard', component: BlankComponent
          }
        ])
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
    fixture = TestBed.createComponent(RegisterPageComponent);
    accountService = TestBed.get(AccountService);
    component = fixture.componentInstance;
    spyOn(accountService, 'registerAppUser').and.callFake(() => {
      return Promise.resolve();
    });
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

  describe('ngOnInit() - check account verification', () => {
    it(`should go straight to register step 3 (verification) if user's account is unverified`, () => {
      const email = 'test@email.com';
      const password = 'Password1234';
      accountService.setUnverifiedUser(email, password);
      component.ngOnInit();
      expect(component.steps).toBe('three');
      expect(component.newCognitoUser.username).toEqual(email);
      expect(component.newCognitoUser.password).toEqual(password);
      expect(component.newCognitoUser.attributes).toEqual(null);
    });

    it(`should go straight to register step 1 (fill in email) if user have not sign up yet`, () => {
      expect(component.steps).toBe('one');
    });
  });

  /* tslint:disable:no-string-literal */
  describe('registerAccountInAws()', () => {
    let uuid;
    let spy;
    beforeEach(() => {
      uuid = uuidv4();
      spy = spyOn(component['accountService'], 'registerCognitoUser')
      .and.returnValue(Promise.resolve({ userSub: uuid }));
    });
    it('should call accountService to register a cognito user', done => {
      component.registerAccountInAws().then(() => {
        expect(spy.calls.count()).toEqual(1);
        expect(component.uuid).toEqual(uuid);
        expect(component.steps).toEqual('three');
        done();
      }).catch(error => processTestError('failed to register account', error, done));
    });

    it('should store the newCognitoUser values', () => {
      const controls = component.registerForm.controls;
      const input: any = {
        email: 'test@email.com',
        firstName: 'Test',
        lastName: 'Test Test',
        password: 'Test1234'
      };
      const params = ['email', 'password', 'firstName', 'lastName'];

      params.forEach(param => setForm(controls, input, param));
      component.registerAccountInAws();
      const user = component.newCognitoUser;
      expect(user.username).toEqual(input.email);
      expect(user.password).toEqual(input.password);
      expect(user.attributes.email).toEqual(input.email);
      expect(user.attributes.given_name).toEqual(input.firstName);
      expect(user.attributes.family_name).toEqual(input.lastName);
    });

    function setForm(controls, input, param) {
      controls[param].setValue(input[param]);
    }
  });

  describe('createAccountInDatabase() - ', () => {
    beforeEach(() => {
      spyOn(component, 'getCognitoUserDetails');
      spyOn(component, 'createAccountInDatabase').and.callThrough();
    });

    it('should call getCognitoUserDetails() if the current user detail is empty', () => {
      component.uuid = 'bla';
      component.newCognitoUser = {
        username: 'khoi-test',
        password: `Khoi1234`,
        attributes: null
      };
      component.createAccountInDatabase();
      expect(component.getCognitoUserDetails).toHaveBeenCalled();
    });

    /* tslint:disable:no-string-literal */
    it('should not call getCognitoUserDetails() if the current user detail is not empty', done => {
      const routerSpy = spyOn(component['router'], 'navigate');
      component.uuid = 'bla';
      component.newCognitoUser = {
        username: 'test@email.com',
        password: `Password1234`,
        attributes: {
          email: `test@email.com`,
          given_name: `test`,
          family_name: `name`
        }
      };
      component.createAccountInDatabase().then(() => {
        expect(routerSpy.calls.count()).toBe(1);
        expect(component.getCognitoUserDetails).not.toHaveBeenCalled();
        expect(accountService.registerAppUser).toHaveBeenCalled();
        done();
      }).catch(error => processTestError(
        'unable to create account in database', error, done)
      );
    });

  });

  it('should get the details of a AWS signed in user', done => {
    component.uuid = 'bla';
    component.newCognitoUser = {
      username: TEST_USERNAME,
      password: TEST_PASSWORD,
      attributes: null
    };
    component.getCognitoUserDetails().then(() => {
      expect(component.newCognitoUser.attributes).not.toBe(null);
      done();
    }).catch(error => processTestError('error during logic step', error, done));
  });

  // fix this when all of the user attribute is set
  it('should set the cognitoUser into the right value', () => {
    const email = 'bla';
    const firstName = 'ble';
    const lastName = 'blo';
    const id = 'blu';
    const userAttribute = {
      sub: id,
      email: `${email}`,
      firstName: `${firstName}`,
      lastName: `${lastName}`
    };
    component['setNewCognitoUser'](userAttribute);
    expect(component.newCognitoUser.attributes.email).toBe(email);
    expect(component.newCognitoUser.attributes.given_name).toBe(firstName);
    expect(component.newCognitoUser.attributes.family_name).toBe(lastName);
    expect(component.uuid).toBe(id);
  });
});
