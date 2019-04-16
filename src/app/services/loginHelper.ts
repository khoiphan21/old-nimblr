import { Auth } from 'aws-amplify';
import { CognitoSignUpUser } from '../classes/user';
import { environment } from '../../environments/environment';
import { API, graphqlOperation } from 'aws-amplify';

import awsmobile from 'src/aws-exports.js';
import { deleteUser, createUser } from '../../graphql/mutations';

const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

export const TEST_USERNAME = 'success@simulator.amazonses.com'; // to prevent rebound
export const TEST_PASSWORD = 'Password1234';

/* istanbul ignore next */
export class LoginHelper {
  /**
   * Will login if not already done so, and return the current session
   */
  static async login(): Promise<any> {
    try {
      // Try to get the session
      return await Auth.currentSession();
    } catch (error) {
      // Failed. Now login and return the new session
      await Auth.signIn(TEST_USERNAME, TEST_PASSWORD);
      return await Auth.currentSession();
    }
  }

  static async createTestUser(): Promise<any> {
    const user: CognitoSignUpUser = {
      username: TEST_USERNAME,
      password: TEST_PASSWORD,
      attributes: {
        email: TEST_USERNAME,
        given_name: 'John',
        family_name: 'Doe'
      }
    };

    // Signup the user in Cognito
    await Auth.signUp(user);
    await adminConfirmUser(TEST_USERNAME);

    const loggedInUser = await Auth.signIn(TEST_USERNAME, TEST_PASSWORD);
    const cognitoUserId = loggedInUser.signInUserSession.idToken.payload.sub;

    // Register in App DB
    const userDetails = {
      input: {
        id: cognitoUserId,
        username: user.username,
        email: user.attributes.email,
        firstName: user.attributes.given_name,
        lastName: user.attributes.family_name,
        documentIds: []
      }
    };

    await API.graphql(graphqlOperation(createUser, userDetails));
  }
}

/* istanbul ignore next */
export async function adminConfirmUser(username: any): Promise<any> {

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

/* istanbul ignore next */
export async function deleteAppUser(id: string): Promise<any> {
  try {
    const input = {
      input: { id }
    };
    await API.graphql(graphqlOperation(deleteUser, input));
    return Promise.resolve('app user deleted');
  } catch (error) {
    return Promise.reject(error);
  }
}

/* istanbul ignore next */
export function adminDeleteCognitoUser(givenUser: any): Promise<any> {

  return new Promise((resolve, reject) => {
    const poolData = {
      UserPoolId: awsmobile.aws_user_pools_id,
      ClientId: awsmobile.aws_user_pools_web_client_id
    };
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

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
