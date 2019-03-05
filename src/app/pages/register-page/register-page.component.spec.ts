import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPageComponent } from './register-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ServicesModule } from '../../modules/services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountService } from '../../services/account/account.service';
import { AccountServiceImpl } from '../../services/account/account-impl.service';
import { BlankComponent } from '../../services/account/account-impl.service.spec';
import { processTestError } from '../../classes/helpers';

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
            path: 'dashboard/:userid', component: BlankComponent
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
      accountService.setUnverifiedUser('test@email.com', 'Password1234');
      component.ngOnInit();
      expect(component.steps).toBe('three');
    });

    it(`should go straight to register step 1 (fill in email) if user have not sign up yet`, () => {
      component.ngOnInit();
      expect(component.steps).toBe('one');
    });
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

    it('should not call getCognitoUserDetails() if the current user detail is not empty', () => {
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
      component.createAccountInDatabase();
      expect(component.getCognitoUserDetails).not.toHaveBeenCalled();
      expect(accountService.registerAppUser).toHaveBeenCalled();
    });
  });

  it('should get the details of a AWS signed in user', done => {
    component.uuid = 'bla';
    component.newCognitoUser = {
      username: 'khoi-test',
      password: `Khoi1234`,
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
    const userAttribute = {
      email: `${email}`,
      phone_number: `${firstName}`
    };
    // const userAttribute = {
    //   email: `${email}`,
    //   firstName: `${firstName}`,
    //   lastName: `${lastName}`
    // };
    const setUser = component['setNewCognitoUser'](userAttribute);
    expect(component.newCognitoUser.attributes.email).toBe(email);
    expect(component.newCognitoUser.attributes.given_name).toBe(firstName);
    expect(component.newCognitoUser.attributes.family_name).toBe(firstName);
  });
});
