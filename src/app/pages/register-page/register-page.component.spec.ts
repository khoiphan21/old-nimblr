import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPageComponent } from './register-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountService } from '../../services/account/account.service';
import { AccountServiceImpl } from '../../services/account/account-impl.service';
import { processTestError } from 'src/app/classes/test-helpers.spec';
import { Auth } from 'aws-amplify';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';

const uuidv4 = require('uuid/v4');

/* tslint:disable:no-string-literal */
fdescribe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;
  let accountService: AccountService;

  // spies
  let registerAppUserSpy: jasmine.Spy;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegisterPageComponent
      ],
      imports: [
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: AccountService,
          useClass: AccountServiceImpl
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPageComponent);
    accountService = TestBed.get(AccountService);
    component = fixture.componentInstance;

    // setup spies
    registerAppUserSpy = spyOn(accountService, 'registerAppUser');
    registerAppUserSpy.and.returnValue(Promise.resolve());

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

  describe('ngOnInit()', () => {
    let routeParamSpy: jasmine.Spy;

    beforeEach(() => {
      routeParamSpy = spyOn<any>(component, 'checkRouteParams');
    });

    describe('check account verification', () => {
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

    it('should call to check route params', () => {
      component.ngOnInit();
      expect(routeParamSpy).toHaveBeenCalled();
    });

  });

  describe('checkRouteParams()', () => {
    let mockRoute: any;
    const mockEmail = 'test@email.com';
    const mockDocId = uuidv4();

    describe('when given email and docId', () => {
      beforeEach(() => {
        mockRoute = {
          paramMap: new BehaviorSubject(new Map([
            ['email', mockEmail],
            ['document', mockDocId]
          ]))
        };
        component['route'] = mockRoute;
        component['checkRouteParams']();
      });

      it('should store the documentId if given', () => {
        expect(component.routeDocumentId).toEqual(mockDocId);
      });
      it('should set the step to "two"', () => {
        expect(component.steps).toEqual('two');
      });
      it('should set the registerForm email', () => {
        expect(component.registerForm.get('email').value).toEqual(mockEmail);
      });
    });

    describe('when no params are available', () => {
      it('should NOT set the step to "two"', () => {
        mockRoute = {
          paramMap: new BehaviorSubject(new Map())
        };
        component['route'] = mockRoute;
        component['checkRouteParams']();
        expect(component.steps).toEqual('one');
      });
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
    let routerSpy: jasmine.Spy;
    let getCognitoSpy: jasmine.Spy;

    beforeEach(() => {
      // setup mock data
      component.uuid = uuidv4();

      // setup spies
      routerSpy = spyOn(component['router'], 'navigate');
      // getCognitoUserDetails()
      getCognitoSpy = spyOn(component, 'getCognitoUserDetails');
      getCognitoSpy.and.returnValue(Promise.resolve());
    });

    it('should call getCognitoUserDetails() if the current user detail is empty', async () => {
      component.newCognitoUser = {
        username: 'khoi-test',
        password: `Khoi1234`,
        attributes: null
      };
      await component.createAccountInDatabase();
      expect(getCognitoSpy).toHaveBeenCalled();
    });

    describe('if user details are available', () => {
      beforeEach(async () => {
        component.newCognitoUser = {
          username: 'test@email.com',
          password: `Password1234`,
          attributes: {
            email: `test@email.com`,
            given_name: `test`,
            family_name: `name`
          }
        };
        await component.createAccountInDatabase();
      });

      it('should not call getCognitoUserDetails()', () => {
        expect(component.getCognitoUserDetails).not.toHaveBeenCalled();
      });
      it('should call registerAppUser() with the right args', () => {
        expect(registerAppUserSpy).toHaveBeenCalledWith(
          component.newCognitoUser, component.uuid
        );
      });
      it('should call router to route to dashboard', () => {
        expect(routerSpy.calls.mostRecent().args[0]).toEqual(['/dashboard']);
      });
      it('should navigate to the documentId if available', async () => {
        component.routeDocumentId = uuidv4();
        await component.createAccountInDatabase();
        expect(routerSpy.calls.mostRecent().args[0]).toEqual([`/document/${component.routeDocumentId}`]);
      });
    });

    it('should stop creating an account into database when theres error in the process', done => {
      getCognitoSpy.and.callFake(() => {
        throw new Error('Failed to get Cognito User');
      });
      component.uuid = 'bla';
      component.newCognitoUser = {
        username: 'khoi-test',
        password: `Khoi1234`,
        attributes: null
      };
      component.createAccountInDatabase().then(() => {
        processTestError('should not create account', '', done);
      }).catch(() => {
        expect().nothing();
        done();
      });
    });

  });

  describe('verifyAccount(', () => {
    beforeEach(() => {
      component.newCognitoUser = {
        username: 'khoi-test',
        password: `Khoi1234`,
        attributes: null
      };
    });

    it('should create an account in the database if the account is verified', done => {
      spyOn(accountService, 'awsConfirmAccount').and.returnValue(Promise.resolve());
      spyOn(component, 'createAccountInDatabase').and.callFake(() => {
        return Promise.resolve();
      });
      const controls = component.verificationForm.controls;
      controls.verificationCode.setValue('bla');
      component.verifyAccount().then(() => {
        expect(component.createAccountInDatabase).toHaveBeenCalled();
        done();
      }).catch(error => {
        processTestError('failed to verify account', error, done);
      }
      );
    });

    it('should not create an account in the database if the account is not verified', done => {
      spyOn(accountService, 'awsConfirmAccount').and.returnValue(Promise.reject('account does not exist'));
      spyOn(component, 'createAccountInDatabase').and.callFake(() => {
        return Promise.resolve();
      });
      const controls = component.verificationForm.controls;
      controls.verificationCode.setValue('bla');
      component.verifyAccount().then(() => {
        processTestError('should not create account', '', done);
      }).catch(() => {
        expect(component.createAccountInDatabase).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('getCognitoUserDetails', () => {
    const user = {
      attributes: {
        email: `test@email.com`,
        given_name: `test`,
        family_name: `name`
      }
    };
    beforeEach(() => {
      component.newCognitoUser = {
        username: 'khoi-test',
        password: `Khoi1234`,
        attributes: null
      };
    });

    it('should should create a user if there are no errors in the process', done => {
      spyOn(Auth, 'signIn').and.returnValue(Promise.resolve());
      spyOn(Auth, 'currentAuthenticatedUser').and.returnValue(Promise.resolve(user));
      spyOn(component, 'createAccountInDatabase').and.callFake(() => {
        return Promise.resolve();
      });
      component.getCognitoUserDetails().then(() => {
        expect(component.createAccountInDatabase).toHaveBeenCalled();
        done();
      }).catch(error => {
        processTestError('should not create account', error, done);
      });
    });

    it('should not create a user if there is any error in the process - (Auth.signIn)', done => {
      spyOn(Auth, 'signIn').and.returnValue(Promise.reject());
      component.getCognitoUserDetails().then(() => {
        processTestError('should not create account', 'Failed in Auth.signIn()', done);
      }).catch(() => {
        expect().nothing();
        done();
      });
    });

    it('should not create a user if there is any error in the process - (Auth.currentAuthenticatedUser)', done => {
      spyOn(Auth, 'signIn').and.returnValue(Promise.resolve());
      spyOn(Auth, 'currentAuthenticatedUser').and.returnValue(Promise.reject());
      component.getCognitoUserDetails().then(() => {
        processTestError('should not create account', 'Failed in Auth.currentAuthenticatedUser()', done);
      }).catch(() => {
        expect().nothing();
        done();
      });
    });
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

  describe('validatePassword()', () => {
    let formControlSpy: jasmine.Spy;
    let callbackFn;
    beforeEach(() => {
      formControlSpy = spyOn(component.registerForm.controls['password'].valueChanges, 'subscribe');
      component.validatePassword();
      callbackFn = formControlSpy.calls.mostRecent().args[0];
    });

    it('should set value to true if there is any lower case', () => {
      callbackFn('test');
      expect(component.hasLowerCase).toBe(true);
    });

    it('should set value to false if there is no lower case', () => {
      callbackFn('TEST');
      expect(component.hasLowerCase).toBe(false);
    });

    it('should set value to true if there is any upper case', () => {
      callbackFn('Test');
      expect(component.hasUpperCase).toBe(true);
    });

    it('should set value to false if there is no upper case', () => {
      callbackFn('test');
      expect(component.hasUpperCase).toBe(false);
    });

    it('should set value to true if there is any number', () => {
      callbackFn('test1');
      expect(component.hasNumber).toBe(true);
    });

    it('should set value to false if there is no number', () => {
      callbackFn('test');
      expect(component.hasNumber).toBe(false);
    });

    it('should set value to true if there is more than 8 characters', () => {
      callbackFn('test1234');
      expect(component.hasLength).toBe(true);
    });

    it('should set value to false if there is less than 8 characters', () => {
      callbackFn('test14');
      expect(component.hasLength).toBe(false);
    });

  });
});
