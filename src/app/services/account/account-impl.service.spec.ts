import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AccountServiceImpl } from './account-impl.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { CognitoSignUpUser, CognitoUserAttributes, User } from '../../classes/user';
import { UnverifiedUser } from './account.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { updateUser } from 'src/graphql/mutations';
import { getUser } from 'src/graphql/queries';
import { UserFactoryService } from '../user/user-factory.service';
import { skip } from 'rxjs/operators';

const uuidv4 = require('uuid/v4');

export class MockAccountService {
  getUser$() {
    return new Subject();
  }
  isUserReady() {
    return new Promise(() => { }); // a promise that never returns
  }
  login() {
    return new Promise(() => { }); // a promise that never returns
  }
  setUnverifiedUser(_, __) { }
  getUnverifiedUser() { }
}

describe('AccountImplService', () => {
  let service: AccountServiceImpl;
  let router: Router;

  beforeAll(async () => {
    await Auth.signOut();
  });

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

  /* tslint:disable:no-string-literal */
  describe('registerAppUser', () => {
    let spyAuth: jasmine.Spy;
    let spyQuery: jasmine.Spy;
    let testUser: CognitoSignUpUser;

    beforeEach(() => {
      spyAuth = spyOn(Auth, 'signIn').and.returnValue(Promise.resolve());
      spyQuery = spyOn(service['graphQLService'], 'query');
      spyQuery.and.returnValue(Promise.resolve());

      const testAttr = {
        email: 'test',
        given_name: 'test',
        family_name: 'test',
      } as CognitoUserAttributes;

      testUser = {
        username: 'test',
        password: 'bar',
        attributes: testAttr,
      };
    });

    it('should always return a promise', () => {
      const data = service.registerAppUser(testUser, '');
      expect(data instanceof Promise).toBeTruthy();
    });

    it('should send user details correctly to aws', done => {
      const testId = 'testID';
      service.registerAppUser(testUser, testId).then(() => {
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

      service.registerAppUser(testUser, '').catch(err => {
        expect(err.message).toEqual(errMsg);
        done();
      });
    });

    it('should return api error message when api query failed', done => {
      const errMsg = 'testing';
      spyQuery.and.returnValue(Promise.reject(new Error(errMsg)));

      const r = service.registerAppUser(testUser, '').catch(err => {
        expect(err.message).toEqual(errMsg);
        done();
      });
    });

  });

  describe('awsConfirmAccount', () => {
    let confirmSignUpSpy: jasmine.Spy;

    beforeEach(() => {
      confirmSignUpSpy = spyOn(Auth, 'confirmSignUp');
      confirmSignUpSpy.and.returnValue('test');
    });

    it('should always return promise type', done => {
      const data = service.awsConfirmAccount('', '');
      expect(data instanceof Promise).toBeTruthy();
      done();
    });

    it('should return error in promise', done => {
      const errMsg = 'testing';
      confirmSignUpSpy.and.returnValue(Promise.reject(new Error(errMsg)));
      service.awsConfirmAccount('', '').catch(err => {
        expect(err.message).toEqual(errMsg);
        done();
      });
    });

    it('should call confirmSignUp api', done => {
      service.awsConfirmAccount('', '').then(() => {
        expect(confirmSignUpSpy.calls.count()).toBe(1);
        done();
      });
    });

  });

  describe('login', () => {
    let spyAuth: jasmine.Spy;
    let spyGetAppUser: jasmine.Spy;
    let mockUserData: any;
    let mockSignUp: any;

    beforeEach(() => {
      mockUserData = 'user test';
      mockSignUp = {
        signInUserSession: { idToken: { payload: { sub: mockUserData } } }
      };

      // Setup spies
      spyAuth = spyOn(Auth, 'signIn');
      spyAuth.and.returnValue(Promise.resolve(mockSignUp));
      spyGetAppUser = spyOn<any>(service, 'getAppUser');
      spyGetAppUser.and.returnValue(Promise.resolve(mockUserData));
    });

    it('should always return a promise', () => {
      const data = service.login('', '');
      expect(data instanceof Promise).toBeTruthy();
    });

    it('should call signIn api', async () => {
      await service.login('', '');
      expect(spyAuth.calls.count()).toBe(1);
    });

    it('should call getAppUser api', async () => {
      await service.login('', '');
      expect(spyGetAppUser.calls.count()).toBe(1);
    });

    it('should resolve with the correct user', async () => {
      const response = await service.login('', '');
      expect(response).toEqual(mockUserData);
    });

    it('should reject when getAppUser failed', async () => {
      const mockErr = 'test err';
      spyGetAppUser.and.returnValue(Promise.reject(new Error(mockErr)));
      try {
        await service.login('', '');
      } catch (err) {
        expect(err.message).toEqual(mockErr);
      }
    });

    it('should reject when signIn failed', async () => {
      const mockErr = 'test err';
      spyAuth.and.returnValue(Promise.reject(new Error(mockErr)));
      try {
        await service.login('', '');
      } catch (err) {
        expect(err.message).toEqual(mockErr);
      }
    });

  });

  describe('logout()', () => {
    let signOutSpy: jasmine.Spy;

    beforeEach(() => {
      signOutSpy = spyOn(Auth, 'signOut');
      signOutSpy.and.returnValue(Promise.resolve('test'));
    });

    it('should call signOut', () => {
      service.logout();
      expect(signOutSpy.calls.count()).toBe(1);
    });

    it('should resolve when signout successfully', async () => {
      await service.logout();
      expect().nothing();
      // should be okay if control reaches here
    });

    it('should emit `null` for the user$ object', async () => {
      // spy on the 'next' method
      service['user$'] = new BehaviorSubject(null);
      const spy = spyOn(service['user$'], 'next');
      await service.logout();
      expect(spy).toHaveBeenCalledWith(null);
    });

    it('should reject with error emitted by signout if failed', done => {
      const message = 'test err';
      signOutSpy.and.returnValue(Promise.reject(message));
      service.logout().catch(error => {
        expect(error).toBe(message);
        done();
      });
    });
  });

  describe('getAppUser()', () => {
    let querySpy: jasmine.Spy;
    let userFactory: UserFactoryService;
    // mock data
    const id = uuidv4;
    const mockUser = {
      id,
      firstName: 'foo',
      lastName: 'bar',
      email: 'foo@bar.com'
    };

    beforeEach(() => {
      userFactory = TestBed.get(UserFactoryService);
      // setup spies
      querySpy = spyOn(service['graphQLService'], 'query');
      querySpy.and.returnValue(Promise.resolve({
        data: { getUser: mockUser }
      }));
    });

    it('should call query with the right query', () => {
      service['getAppUser'](id);
      expect(querySpy).toHaveBeenCalledWith(getUser, { id });
    });

    it('should resolve with the right app user', async () => {
      const expectedUser = userFactory.createUser(
        mockUser.id,
        mockUser.firstName,
        mockUser.lastName,
        mockUser.email
      );
      const user = await service['getAppUser'](id);
      expect(user).toEqual(expectedUser);
    });

    it('should reject with an error if received', async () => {
      const message = 'test';
      querySpy.and.returnValue(Promise.reject(message));
      try {
        await service['getAppUser'](id);
      } catch (error) {
        expect(error).toEqual(message);
      }
    });
  });

  describe('update()', () => {
    let mockUser: User;

    let spyCurrentAuthUser: jasmine.Spy;
    let spyAuthUpdateuser: jasmine.Spy;
    let spyAPI: jasmine.Spy;

    const errorMessage = 'error message';

    beforeEach(() => {
      mockUser = {
        id: 'testID',
        email: 'testEmail',
        firstName: 'testFirstName',
        lastName: 'testLastName',
      };

      spyCurrentAuthUser = spyOn(Auth, 'currentAuthenticatedUser');
      spyCurrentAuthUser.and.returnValue(Promise.resolve(mockUser));

      spyAuthUpdateuser = spyOn(Auth, 'updateUserAttributes');
      spyAuthUpdateuser.and.returnValue(Promise.resolve());

      spyAPI = spyOn(API, 'graphql').and.returnValue(Promise.resolve(mockUser));
    });

    it('should return promise', () => {
      const data = service.update(mockUser);
      expect(data instanceof Promise).toBeTruthy();
    });

    it('should call currentAuthenticatedUser first', async () => {
      service.update(mockUser);
      expect(spyCurrentAuthUser.calls.count()).toBe(1);
    });

    it('should call updateUserAttributes with the right args', async () => {
      await service.update(mockUser);
      expect(spyAuthUpdateuser).toHaveBeenCalledWith(
        mockUser, { email: mockUser.email }
      );
    });

    it('should call graphQl query api with the right args', async () => {
      await service.update(mockUser);
      expect(spyAPI).toHaveBeenCalledWith(
        graphqlOperation(updateUser, { input: mockUser })
      );
    });

    it('should reject with correct err from currentAuthenticatedUser', done => {
      spyCurrentAuthUser.and.returnValue(Promise.reject(errorMessage));
      service.update(mockUser).catch(err => {
        expect(err).toEqual(errorMessage);
        done();
      });
    });

    it('should reject with correct err if updateUserAttributes failed', done => {
      spyAuthUpdateuser.and.returnValue(Promise.reject(errorMessage));
      service.update(mockUser).catch(err => {
        expect(err).toEqual(errorMessage);
        done();
      });
    });

    it('should reject with correct err if graphql update failed', done => {
      spyAPI.and.returnValue(Promise.reject(errorMessage));
      service.update(mockUser).catch(err => {
        expect(err).toEqual(errorMessage);
        done();
      });
    });

  });

  describe('getUser$', () => {
    let spySession: jasmine.Spy;

    const mockUser: User = {
      id: 'test1',
      firstName: 'test1',
      lastName: 'test1',
      email: 'test1',
    };

    beforeEach(() => {
      spySession = spyOn<any>(service, 'restoreSession');
      spySession.and.returnValue(Promise.resolve(mockUser));
    });

    it('should call restoreSession when getUser$ is called', () => {
      service.getUser$();
      expect(spySession.calls.count()).toBe(1);
    });

    it('should restore the value of user$ correctly', done => {
      service.getUser$().pipe(skip(1)).subscribe(value => {
        expect(value).toEqual(mockUser);
        done();
      });
    });

    it('should return error when no user is identified', done => {
      spySession.and.returnValue(Promise.reject(new Error('test err')));

      service.getUser$().subscribe(() => { }, err => {
        expect(err).toEqual('User is not logged in');
        done();
      });
    });

  });

  /* tslint:disable:no-string-literal */
  describe('restoreSession()', () => {
    let mockUser: User;
    let cloudSession: any;

    beforeEach(() => {
      mockUser = {
        id: 'test1',
        firstName: 'first',
        lastName: 'last',
        email: 'test1@mail.com',
      };
      cloudSession = {
        getIdToken: () => ({ payload: { sub: 'test' } })
      };
      spyOn(Auth, 'currentSession').and.returnValue(Promise.resolve(cloudSession));
    });

    it('should return a user when user is successfully retrieved', done => {
      spyOn<any>(service, 'getAppUser').and.returnValue(mockUser);
      service['restoreSession']().then(data => {
        expect(data).toEqual(mockUser);
        done();
      });
    });

    it('should be rejected a user when user is unsuccessfully retrieved', done => {
      spyOn<any>(service, 'getAppUser').and.returnValue(Promise.reject(new Error('test')));

      service['restoreSession']().catch(err => {
        expect(err.message).toEqual('test');
        done();
      });
    });
  });

  describe('isUserReady', () => {
    let observableObj: BehaviorSubject<User>;
    beforeEach(() => {
      observableObj = new BehaviorSubject<User>(null);
      spyOn(service, 'getUser$').and.returnValue(observableObj);
    });

    it('should resolve user when getUser$ obtained successfully', done => {
      const mockUser = {
        id: 'test1',
        firstName: 'test1',
        lastName: 'test1',
        email: 'test1',
      };

      service.isUserReady().then(data => {
        expect(data).toEqual(mockUser);
        done();
      });
      observableObj.next(mockUser);
    });

    it('should emit error when getUser$ is rejected', done => {
      const message = 'error message';
      service.isUserReady().catch(error => {
        expect(error).toEqual(message);
        done();
      });
      observableObj.error(message);
    });
  });

});
