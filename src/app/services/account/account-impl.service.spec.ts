import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
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

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');

export const TEST_USERNAME = 'khoi-test';
export const TEST_PASSWORD = 'Khoi1234';
export const TEST_USER_ID = '85a705f1-7485-4efd-9e4a-d196ff8c9219';

@Component({
  selector: 'app-header',
  template: ''
})
export class BlankComponent { }

describe('AccountImplService', () => {
  let service: AccountServiceImpl;
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlankComponent],
      providers: [AccountServiceImpl],
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([
          {
            path: 'login', component: BlankComponent
          }
        ])
      ]
    });
    service = TestBed.get(AccountServiceImpl);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login if the credentials are correct', done => {
    service.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
      // should resolve
      done();
    }).catch(error => {
      console.error(error);
      fail(error);
      done();
    });
  });

  it('should fail in the credentials are wrong', done => {
    const password = 'WRONG PASSWORD';

    service.login(TEST_USERNAME, password).then(() => {
      // should have failed
      fail('Promise should be rejected');
      done();
    }).catch(() => {
      done();
    });
  });

  it('should emit a new user object if successfully logged in', done => {
    // Setup subscription for assertion
    service.getUser$().subscribe(value => {
      // should be called here
      done();
    }, error => {
      fail(error);
      done();
    });
    // Call login method here
    service.login(TEST_USERNAME, TEST_PASSWORD).catch(error => {
      fail(error);
      done();
    });
  });

  describe('RegisterService', () => {
    const poolData = {
      UserPoolId: 'ap-southeast-2_d6cypRasd',
      ClientId: '30aaqa11def8pv48lbg18iu8f9'
    };
    let userPool;

    const newCognitoUser: CognitoSignUpUser = {
      username: 'khoi-test-2',
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
      service['awsConfirmAccount'] = () => {
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
        return service.registerAppUser(newCognitoUser, cognitoUserId, 'random-code');
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

  describe('Logout()', () => {
    const user: User = {
      id: 'abc123',
      firstName: 'tester',
      lastName: 'tesla',
      email: 'notshownindb@test.com'
    };

    it('should throw error when a private operation is perform after loggout', done => {
      service.login(TEST_USERNAME, TEST_PASSWORD)
        .then(() => {
          console.log('step 1');
          // let spam =  await service.logout(); // await only allowed in async
          return service.logout(); // i just want it to wait until its actually logged out...
        }).then(() => {
          try {
            console.log('step 2');
            service.update(user).then(() => {
              fail('private operation shouldnt be performing when logged out');
              done();
            })
          } catch (err) {
            err.then(err => {
              console.log('This error is returned by AWS: ', err);
              done();
            });
          }
        }

        );
    });
  });

  describe('update()', () => {
    const user: User = {
      id: 'abc123',
      firstName: 'tester',
      lastName: 'telstra',
      email: 'changed@test.com'
    };

    beforeEach(() => {
      // Login before everything
      service.login(TEST_USERNAME, TEST_PASSWORD).then(
        data => console.log(data));
    });

    it('should update the attributes on dynamodb', done => {
      service.update(user);
    });

  });

  describe('getUser$()', () => {
    it('should retrieve a user if the user session is still valid', done => {
      service.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
        // 'Reset' the observable, pretending that it's empty
        service['user$'].next(null);
        service.getUser$().pipe(skip(1)).subscribe(user => {
          expect(user instanceof UserImpl).toBe(true);
          done();
        });
      });
    });

    it(`should reroute to 'login' if a session doesn't exist`, done => {
      const routerSpy = spyOn(router, 'navigate');
      Auth.signOut()
        .then(() => {
          service.getUser$().subscribe(() => {
          }, () => {
            expect(routerSpy).toHaveBeenCalled();
            done();
          });
        })
        .catch(err => { console.error(err); done(); });
    });
  });

  describe('isUserReady()', () => {

    it('should resolve if a session exists', (done) => {
      service.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
        service.isUserReady().then(user => {
          expect(user instanceof UserImpl).toBe(true);
          done();
        });
      });
    });

    it('should reject if no user available', done => {
      Auth.signOut().then(() => {
        service.isUserReady().then(user => {
          fail('error must occur');
        }).catch(() => done());
      });
    });

  });


});
