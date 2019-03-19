import { TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AccountServiceImpl } from './account-impl.service';
import { ServicesModule } from '../../modules/services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { CognitoSignUpUser, CognitoUserAttributes } from '../../classes/user';
import { UnverifiedUser } from './account.service';
import { Subject } from 'rxjs';
import { promised } from 'q';
import { onErrorResumeNext } from 'rxjs/operators';

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

export const TEST_USERNAME = 'p1354930@nwytg.net';
export const TEST_PASSWORD = 'Test1234';
export const TEST_USER_ID = '88627eeb-f992-477f-8728-cfc01929c379';

export class MockAccountService {
  getUser$() {
    return new Subject();
  }
  isUserReady() {
    return new Promise((_, __) => { }); // a promise that never returns
  }
  login() {
    return new Promise((_, __) => { }); // a promise that never returns
  }
  setUnverifiedUser(_, __) { }
  getUnverifiedUser() { }
}


const uuidv4 = require('uuid/v4');

describe('AccountImplService', () => {
  let service: AccountServiceImpl;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountServiceImpl],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    service = TestBed.get(AccountServiceImpl);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get/set Unverified User()', () => {

    it('should set and get an UnverifiedUser', () => {
      const email = 'test@email.com';
      const password = 'Password1234';
      let storedUser: UnverifiedUser;
      service.setUnverifiedUser(email, password);
      storedUser = service.getUnverifiedUser();
      expect(storedUser).toEqual({ email, password });
    });

  });

  describe('registerCognitoUser()', () => {
    const poolData = {
      UserPoolId: 'ap-southeast-2_d6cypRasd',
      ClientId: '30aaqa11def8pv48lbg18iu8f9'
    };
    let userPool;

    const newCognitoUser: CognitoSignUpUser = {
      username: uuidv4(),
      password: 'Test1234',
      attributes: {
        email: 'success@simulator.amazonses.com', // for email to be sent successfully
        given_name: 'Test',
        family_name: 'Account'
      }
    };

    beforeEach(() => {
      userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

      // logout of any existing user
      const currentUser = userPool.getCurrentUser();
      if (currentUser !== null) {
        currentUser.signOut();
      }
    });

    it('should call Auth with the right parameters', done => {
      // Setup spy to check parameters
      const mockData = { id: '1234' };
      const authSpy = spyOn(Auth, 'signUp')
        .and.returnValue(Promise.resolve(mockData));
      // Call the service to register
      service.registerCognitoUser(newCognitoUser).then(data => {
        expect(data).toEqual(mockData);
        expect(authSpy.calls.mostRecent().args[0]).toEqual(newCognitoUser);
        done();
      });
    });

    it('should throw an error if unable to sign up', done => {
      const message = 'Error message';
      const authSpy = spyOn(Auth, 'signUp').and.returnValue(Promise.reject(message));
      service.registerCognitoUser(newCognitoUser).then(() => {
        fail('error should occur'); done();
      }).catch(error => {
        expect(authSpy.calls.count()).toBe(1);
        expect(error).toEqual(message);
        done();
      });
    });

  });

  describe('registerCognitoUser', () => {
    let testValue: any;
    let spySignup: jasmine.Spy;
    let testUser: CognitoSignUpUser;

    beforeEach(() => {
      testValue = { value: 'testing' };
      spySignup = spyOn(Auth, 'signUp');
      spySignup.and.returnValue(Promise.resolve(testValue));
      testUser = {} as CognitoSignUpUser;
    });

    it('should return promise type', () => {
      const response = service.registerCognitoUser(testUser);
      expect(response instanceof Promise).toBeTruthy();
    });

    it('should call signup api', () => {
      service.registerCognitoUser(testUser);
      expect(spySignup.calls.count()).toEqual(1);
    });

    it('should return api error when signup api failed', done => {
      const errorMessage = 'testing';
      spySignup.and.returnValue(Promise.reject(new Error(errorMessage)));

      const response = service.registerCognitoUser(testUser);
      response.catch(err => {
        expect(err.message).toEqual(errorMessage);
        done();
      });
    });
  });

  describe('awsConfirmAccount', () => {
    beforeEach(() => {});

    it('should always return promise type', done => {
      spyOn(Auth, 'confirmSignUp').and.returnValue('test');
      const data = service.awsConfirmAccount('', '');
      expect(data instanceof Promise).toBeTruthy();
      done();
    });

    it('should return error in promise', done => {
      const errMsg = 'testing';
      spyOn(Auth, 'confirmSignUp').and.returnValue(Promise.reject(new Error(errMsg)));
      service.awsConfirmAccount('', '').catch(err => {
        expect(err.message).toEqual(errMsg);
        done();
      });
    });

    it('should call confirmSignUp api', done => {
      const spyAws = spyOn(Auth, 'confirmSignUp').and.returnValue('test');
      service.awsConfirmAccount('', '').then(_ => {
        expect(spyAws.calls.count()).toBe(1);
        done();
      })
    });

  });

  describe('registerAppUser', () => {
    let spyAuth;
    let spyQuery;
    let testUser;

    beforeEach(() => {
      spyAuth = spyOn(Auth, 'signIn').and.returnValue(Promise.resolve('ok'));
      spyQuery = spyOn(service['graphQLService'], 'query').and.returnValue(Promise.resolve('ok'));

      const testAttr = {
        email: 'test',
        given_name: 'test',
        family_name: 'test',
      } as CognitoUserAttributes;

      testUser = {
        username: 'test',
        attributes: testAttr,
      } as CognitoSignUpUser;
    });

    async function makeSureItReturnsAPromise(returnObj){
      expect(returnObj instanceof Promise).toBeTruthy();
    };

    it('should always return a promise', () => {
      // Thought of the day: might need to test the return type after all path to 
      // make sure it is always returning Promise type?
      const data = service.registerAppUser(testUser, '');
      expect(data instanceof Promise).toBeTruthy();
    });

    // it('should call graphQL query api only after signIn api is called', () => {
    //   // call fake? attach to list?
    //   service.registerAppUser(testUser, '').then(_=>{
    //     expect(spyAuth.calls.count()).toBe(1);
    //     expect(spyQuery.calls.count()).toBe(1);
    //   });
    // });

    it('should send user details correctly to aws', done => {
      const testId = 'testID';
      service.registerAppUser(testUser, testId).then(data => {
        const userInput = spyQuery.calls.mostRecent().args[1].input;
        expect(userInput.id).toEqual(testId);
        expect(userInput.username).toEqual(testUser.username);
        expect(userInput.email).toEqual(testUser.attributes.email);
        expect(userInput.firstName).toEqual(testUser.attributes.given_name);
        expect(userInput.lastName).toEqual(testUser.attributes.family_name);
        done();
      });
    });

    it('should return api error message when singIn failed', done => {
      const errMsg = 'testing';
      spyAuth.and.returnValue(Promise.reject(new Error(errMsg)));

      console.log(testUser);
      const r = service.registerAppUser(testUser, '').catch(err => {
        expect(err.message).toEqual(errMsg);
        done();
      });

      makeSureItReturnsAPromise(r);
    });

    it('should return api error message when api query failed', done => {
      const errMsg = 'testing';
      spyQuery.and.returnValue(Promise.reject(new Error(errMsg)));

      const r = service.registerAppUser(testUser, '').catch(err => {
        expect(err.message).toEqual(errMsg);
        done();
      });

      makeSureItReturnsAPromise(r);
    });

  });

  describe('login', () => {
    beforeEach(() => { });

    it('should always return a promise', () => {

    });

    it('should call signIn api', () => {

    });

  });

  describe('logout', () => {
    beforeEach(() => { });

    it('should always return a promise', () => {

    });

    it('should call signOut api', () => {

    });
  });

  describe('update', () => {
    beforeEach(() => { });

    it('should always return a promise', () => {

    });

    it('should call signOut api', () => {

    });

  });

  describe('getUser', () => {
    it('should always return an observable', () => {

    });

    it('should call signOut api', () => {

    });

  });

  describe('isUserReady', () => {
    it('should always return an observable', () => {

    });

    it('should resolve after getUser is called', () => {

    });

    it('should reject after getUser returns error', () => {

    });

  });

});
