import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AccountServiceImpl } from './account-impl.service';
import { ServicesModule } from '../../modules/services.module';
import { skip } from 'rxjs/operators';
import { UserImpl } from 'src/app/classes/user-impl';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { User } from 'src/app/classes/user';
import { CognitoSignUpUser } from '../../classes/user';
import awsmobile from 'src/aws-exports.js';
import { environment } from '../../../environments/environment';
import { getUser } from '../../../graphql/queries';
import { processTestError } from 'src/app/classes/test-helpers.spec';
import { deleteAppUser, adminDeleteCognitoUser, adminConfirmUser, TEST_USERNAME, TEST_PASSWORD } from '../loginHelper';
import { configureTestSuite } from 'ng-bullet';

const uuidv4 = require('uuid/v4');

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');

describe('(Integration) AccountImplService', () => {
  let service: AccountServiceImpl;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [AccountServiceImpl],
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  beforeEach(() => {
    service = TestBed.get(AccountServiceImpl);
    router = TestBed.get(Router);
  });

  describe('registerCognitoUser()', () => {
    const poolData = {
      UserPoolId: awsmobile.aws_user_pools_id,
      ClientId: awsmobile.aws_user_pools_web_client_id
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

    it('should register a user in cognito successfully and then delete it', async () => {
      await service.registerCognitoUser(newCognitoUser);
      await adminConfirmUser(newCognitoUser.username);
      const message = await adminDeleteCognitoUser(newCognitoUser);
      expect(message).toEqual('SUCCESS');
    }, environment.TIMEOUT_FOR_UPDATE_TEST);

    it('should create then delete a user for the app in DynamoDB', done => {
      // mock the verification function
      let cognitoUserId: string;

      // Mock the function to confirm verification code with AWS
      service.awsConfirmAccount = () => {
        return Promise.resolve();
      };

      // Start the test
      service.registerCognitoUser(newCognitoUser).then(() => {
        return adminConfirmUser(newCognitoUser.username);
      }).then(() => {
        // Sign in to get the user id, and authenticate for graphQL queries
        return Auth.signIn(newCognitoUser.username, newCognitoUser.password);
      }).then(loggedInUser => {
        // Now register app user and check if it's registered properly
        cognitoUserId = loggedInUser.signInUserSession.idToken.payload.sub;
        return service.registerAppUser(newCognitoUser, cognitoUserId);
      }).then(response => {
        // Check that all expected attributes are there, and match with the originals
        expect(response).toBeTruthy();
        expect(response.data.createUser.id).toEqual(cognitoUserId);
        expect(response.data.createUser.email).toEqual(newCognitoUser.attributes.email);
        expect(response.data.createUser.firstName).toEqual(newCognitoUser.attributes.given_name);
        expect(response.data.createUser.lastName).toEqual(newCognitoUser.attributes.family_name);
        expect(response.data.createUser.username).toEqual(newCognitoUser.username);
        // delete the app user in DynamoDB
        return deleteAppUser(cognitoUserId);
      }).then(result => {
        expect(result).toEqual('app user deleted');
        return Auth.signOut(); // Sign out
      }).then(() => {
        // delete the test user
        return adminDeleteCognitoUser(newCognitoUser);
      }).then(message => {
        // should be okay here
        expect(message).toEqual('SUCCESS');
        done();
      }).catch(error => { fail(error); done(); });

    }, 10000);

  });

  describe('login', () => {
    it('should login if the credentials are correct', done => {
      service.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
        // should resolve
        done();
      }).catch(error => processTestError('failed to login', error, done));
    });

    it('should fail in the credentials are wrong', done => {
      const password = 'WRONG PASSWORD';
      const errorMessage = 'Promise should be rejected';

      service.login(TEST_USERNAME, password).then(() =>
        processTestError(errorMessage, errorMessage, done)
      ).catch(() => done());
    }, environment.TIMEOUT_FOR_UPDATE_TEST);

    it('should emit a new user object if successfully logged in', done => {
      service.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
        // Setup subscription for assertion
        service.getUser$().subscribe(user => {
          if (user === null) { return; }
          // should be called here
          expect(user).toBeTruthy();
          done();
        }, error => processTestError('unable to get user', error, done));
      }).catch(error => processTestError('failed to login', error, done));
    });

  });

  describe('Logout()', () => {
    const user: User = {
      id: 'abc123',
      firstName: 'tester',
      lastName: 'tesla',
      email: 'notshownindb@test.com'
    };

    it('should throw error when another operation is perform after logout', done => {
      const errorMessage = 'private operation should not be valid after logged out';
      service.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
        return service.logout();
      }).then(() => {
        return service.update(user);
      }).then(() => processTestError(errorMessage, errorMessage, done)
      ).catch(error => {
        expect(error).toBeTruthy();
        done();
      });
    });
  });


  describe('update()', () => {

    it('should update the attributes on dynamodb', async () => {
      const details: User = {
        id: '',
        firstName: 'first',
        lastName: 'last',
        email: 'testing1@test.com'
      };

      // step 0: sign in
      const user = await service.login(TEST_USERNAME, TEST_PASSWORD);

      // update the user id in the mock inputs
      details.id = user.id;

      await service.update(details);

      // Change details
      details.firstName = 'first2';
      details.lastName = 'last2';
      details.email = 'email2@test.com';
      await service.update(details);

      // Now retrieve the details and check
      const response: any = await API.graphql(graphqlOperation(getUser, { id: user.id }));
      expect(response).toBeTruthy();
      expect(response.data.getUser.email).toEqual(details.email);
      expect(response.data.getUser.firstName).toEqual(details.firstName);
      expect(response.data.getUser.lastName).toEqual(details.lastName);

    }, environment.TIMEOUT_FOR_UPDATE_TEST);
  });

  /* tslint:disable:no-string-literal */
  describe('getUser$()', () => {

    it('should retrieve a user if the user session is still valid', done => {
      service.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
        // 'Reset' the observable, pretending that it's empty
        service['user$'].next(null);
        service.getUser$().pipe(skip(1)).subscribe(user => {
          expect(user instanceof UserImpl).toBe(true);
          done();
        }, error => processTestError('getUser$ unable to retrieve', error, done));
      });
    });

  });

  describe('isUserReady()', () => {

    it('should resolve if a session exists', done => {
      service.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
        service.isUserReady().then(user => {
          expect(user instanceof UserImpl).toBe(true);
          done();
        }).catch(error => processTestError('user should be logged in', error, done));
      }).catch(error => processTestError('unable to login', error, done));
    });

    it('should reject if no user available', done => {
      Auth.signOut().then(() => {
        service.isUserReady().then(() => {
          fail('error must occur');
        }).catch(() => {
          done();
        });
      }).catch(error => processTestError('unable to sign out', error, done));
    });

  });

});
