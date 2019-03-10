import { TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { UnverifiedUser } from './account.service';
import { Subject } from 'rxjs';
import { processTestError } from 'src/app/classes/test-helpers.spec';

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

    function adminDeleteCognitoUser(newCognitoUser): Promise<any> {

      return new Promise((resolve, reject) => {
        const userData = {
          Username: newCognitoUser.username,
          Pool: userPool
        };
        const authenticationData = {
          Username: newCognitoUser.username,
          Password: newCognitoUser.password
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
})