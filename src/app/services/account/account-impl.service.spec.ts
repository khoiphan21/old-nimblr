import { TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AccountServiceImpl } from './account-impl.service';
import { ServicesModule } from '../../modules/services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { CognitoSignUpUser } from '../../classes/user';
import { UnverifiedUser } from './account.service';
import { Subject } from 'rxjs';

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

});
