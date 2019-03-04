import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { User, CognitoSignUpUser } from '../../classes/user';

import { Auth, API, graphqlOperation } from 'aws-amplify';
import { take, timeout, catchError } from 'rxjs/operators';

import * as queries from '../../../graphql/queries';
import { UserFactoryService } from '../user/user-factory.service';
import { Router } from '@angular/router';

import { createUser, updateUser } from '../../../graphql/mutations';
import { GraphQLService } from '../graphQL/graph-ql.service';

@Injectable({
  providedIn: 'root'
})
export class AccountServiceImpl implements AccountService {

  private user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(
    private userFactory: UserFactoryService,
    private graphQLService: GraphQLService,
    private router: Router
  ) {
  }

  private restoreSession(): Promise<User> {
    return Auth.currentSession()
      .then(data => {
        return this.getAppUser(data.getIdToken().payload.sub);
      })
      .then((user: User) => {
        console.log('retrieved session for user: ', user.email);
        this.user$.next(user);
        return Promise.resolve(user);
      })
      .catch(() => {
        return Promise.reject();
      });
  }

  async registerCognitoUser(user: CognitoSignUpUser): Promise<any> {

    return new Promise((resolve, reject) => {
      Auth.signUp(user).then(data => {
        resolve(data);
      }).catch(error => reject(error));
    });
  }

  private async awsConfirmAccount(email: string, code: string): Promise<any> {
    // Note: this function can never be automatically tested, as it requires
    // manual checking of email address, which is a pain to automate for now.
    return Auth.confirmSignUp(email, code, {
      forceAliasCreation: true
    });
  }

  async registerAppUser(user: CognitoSignUpUser, userId: string, verificationCode: string): Promise<any> {
    return this.awsConfirmAccount(user.attributes.email, verificationCode).then(() => {
      // 2. Sign in to Cognito to perform graphql
      return Auth.signIn(user.username, user.password);
    }).then(() => {
      // 3. Register in App DB
      const userDetails = {
        input: {
          id: userId,
          username: user.username,
          email: user.attributes.email,
          firstName: user.attributes.given_name,
          lastName: user.attributes.family_name,
          documentIds: []
        }
      };

      return this.graphQLService.query(createUser, userDetails);
    }).then(result => {
      return Promise.resolve(result);
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  private async getAppUser(cognitoUserId: string): Promise<User> {
    try {
      const userDetails = {
        id: cognitoUserId
      };

      const response: any = await API.graphql(
        graphqlOperation(queries.getUser, userDetails)
      );

      const rawUser = response.data.getUser;
      // convert the raw user object to the app's format
      const user: User = this.userFactory.createUser(
        rawUser.id,
        rawUser.firstName,
        rawUser.lastName,
        rawUser.email
      );

      return Promise.resolve(user);
    } catch (error) { return Promise.reject(error); }
  }

  async login(username: string, password: string): Promise<any> {

    return new Promise((resolve, reject) => {
      Auth.signIn(username, password).then(
        cognitoUser => {
          const userId = cognitoUser.signInUserSession.idToken.payload.sub;
          this.getAppUser(userId).then(user => {
            this.user$.next(user);
            resolve();
          }).catch(error => {
            reject(error);
          });
        }
      ).catch(error => reject(error));
    });
  }

  async logout(): Promise<boolean> {
    // Change state of Auth class and class vairable
    // Has to return a promise, because it gives feedback to user
    // about whether they are actually logged out safely.

    return new Promise((resolve, _) => {
      Auth.signOut()
        .then(data => {
          this.user$.next(null);
          console.log('Auth logged out successfully');
          resolve(true);
        })
        .catch(err => {
          console.log(err);
          resolve(false);
        });
    });
  }

  async update(user: User): Promise<any> {
    // Purpose: update the details of a user who have already been registered
    // Case: Auth already signed in
    // Otherwise shoudl throw error saying that user not signin

    // if i want to return promise directly, return a new promise object

    const input = {
      input: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    }

    try {
      // update info in Cognito
      let userDB = await Auth.currentAuthenticatedUser();
      let result = await Auth.updateUserAttributes(userDB, {
        'email': user.email
      });

      // update info in dynamodb
      const response = await API.graphql(graphqlOperation(updateUser, input));
      return Promise.resolve('user updated')

    } catch (err) {
      return Promise.reject(err)
    }

  }

  getUser$(): Observable<User> {
    this.user$.pipe(take(1)).subscribe(user => {
      if (user === null) {
        // retrieve user from session if possible, otherwise reroute to 'login'
        this.restoreSession().then((loggedInUser: User) => {
          this.user$.next(loggedInUser);
        }).catch(() => {
          this.router.navigate(['login']);
          this.user$.error('User is not logged in');
        });
      }
    });
    return this.user$;
  }

  async isUserReady(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getUser$()
        .pipe(timeout(2500))
        .subscribe((user: User) => {
          if (user) {
            resolve(user);
          }
        }, error => {
          console.error('Error in isUserReady()');
          reject(error);
        });
    });
  }

}
