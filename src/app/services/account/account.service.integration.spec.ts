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
import awsmobile from 'src/aws-exports';
import { environment } from '../../../environments/environment';
import { deleteUser } from '../../../graphql/mutations';
import { getUser } from '../../../graphql/queries';
import { processTestError } from 'src/app/classes/test-helpers.spec';
import { TEST_USERNAME, TEST_PASSWORD, TEST_USER_ID } from './account-impl.service.spec';

const uuidv4 = require('uuid/v4');

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');

describe('(Integration) AccountImplService', () => {
  let service: AccountServiceImpl;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountServiceImpl],
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
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

    it('should register a user in cognito successfully and then delete it', done => {
      service.registerCognitoUser(newCognitoUser).then(() => {
        return adminConfirmUser(newCognitoUser.username);
      }).then(() => {
        return adminDeleteCognitoUser(newCognitoUser);
      }).then(message => {
        expect(message).toEqual('SUCCESS');
        done();
      }).catch(error => { fail(error); done(); });
    }, 20000);

    async function adminConfirmUser(username: any): Promise<any> {

      return new Promise((resolve, reject) => {
        // configure cognito identity service provider
        const options = {
          accessKeyId: environment.AWS_ACCESS_KEY_ID,
          secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
          region: awsmobile.aws_cognito_region
        };
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(options);

        const params = {
          UserPoolId: awsmobile.aws_user_pools_id, /* required */
          Username: username /* required */
        };

        // set the status of the user to 'CONFIRMED'
        cognitoidentityserviceprovider.adminConfirmSignUp(params, (err, data) => {
          if (err) { reject(err); } else { resolve(data); } // successful response
        });
      });
    }

    function adminDeleteCognitoUser(givenUser: any): Promise<any> {

      return new Promise((resolve, reject) => {
        const userData = {
          Username: givenUser.username,
          Pool: userPool
        };
        const authenticationData = {
          Username: givenUser.username,
          Password: givenUser.password
        };
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: () => {
            cognitoUser.deleteUser((err, result) => {
              if (err) { reject(err); return; }
              resolve(result);
            });
          },
          onFailure: error => reject(error)
        });
      });
    }

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

      async function deleteAppUser(id: string): Promise<any> {
        try {
          const input = {
            input: { id }
          };
          const response: any = await API.graphql(graphqlOperation(deleteUser, input));
          expect(response.data.deleteUser.id).toEqual(id);
          return Promise.resolve('app user deleted');
        } catch (error) {
          return Promise.reject(error);
        }
      }
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
    });

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

    it('should update the attributes on dynamodb', done => {

      const userBefore: User = {
        id: TEST_USER_ID,
        firstName: 'test1',
        lastName: 'test1',
        email: 'testing1@test.com'
      };

      const userAfter: User = {
        id: TEST_USER_ID,
        firstName: 'test2',
        lastName: 'test2',
        email: 'testing2@test.com'
      };

      // step 0: sign in
      service.login(TEST_USERNAME, TEST_PASSWORD).then(data => {
        return data;

      }).then(() => {
        return service.update(userBefore);
      }).then(() => {
        return service.update(userAfter);
      }).then(() => {
        const input = {
          id: TEST_USER_ID
        };

        async function getApiCall() {
          const response: any = await API.graphql(graphqlOperation(getUser, input));
          return Promise.resolve(response);
        }

        getApiCall().then(response => {
          expect(response).toBeTruthy();
          expect(response.data.getUser.email).toEqual(userAfter.email);
          expect(response.data.getUser.firstName).toEqual(userAfter.firstName);
          expect(response.data.getUser.lastName).toEqual(userAfter.lastName);
          done();
        });

      });
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
