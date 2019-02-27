import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { User } from '../../classes/user';

import { Auth, API, graphqlOperation } from 'aws-amplify';
import { take, timeout, catchError } from 'rxjs/operators';

import * as queries from '../../../graphql/queries';
import { UserFactoryService } from '../user/user-factory.service';
import { Router } from '@angular/router';

import { createUser, updateUser } from '../../../graphql/mutations';

@Injectable({
  providedIn: 'root'
})
export class AccountServiceImpl implements AccountService {

  private user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(
    private userFactory: UserFactoryService,
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

  register(user: User): Observable<boolean> {

    return null;
  }

  async registerCognitoUser(user: User, password: string): Promise<any> {
    // TODO: code works!!! Just need to configure a bit and test
    // Step 1: register user into the pool
    const newUser = {
      username: user.email,
      password: password,
      attributes: { email: user.email }
    };

    Auth.signUp(newUser).then(data => {
      console.log('1 signup: ', data);
    })
  }

  async registerAppUser(user: User, password: string, verificationCode: string): Promise<any> {

    // 1. Confirm code with aws
    Auth.confirmSignUp(user.email, verificationCode, {
      forceAliasCreation: true
    }).then(data => {
      console.log(data);
      return data;
    }).then(data => {

      // 2. Sign in to Cognito to perform graphql
      Auth.signIn(user.email, password).then(
        cognitoUser => {
          this.getAppUser(cognitoUser.username).then
            (usercog => {
              this.user$.next(usercog);
            })
          return cognitoUser;
        })
    }).then(data => {

      // 3. Register in App DB
      const userDB = {
        input: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          documentIds: 0
        }
      };

      const response = API.graphql(
        graphqlOperation(createUser, userDB)
      );

      console.log('graphql: ', response);

    }).catch(
      err => console.log('signup failed: ', err)
    );
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
    } catch (error) { Promise.reject(error); }
  }


  // Bruno
  async login(email: string, password: string): Promise<any> {

    return new Promise((resolve, reject) => {
      Auth.signIn(email, password).then(
        cognitoUser => {
          this.getAppUser(cognitoUser.username).then(user => {
            this.user$.next(user);
            resolve();
          });
        }
      ).catch(error => reject(error));
    });
  }

  logout(): void {
    Auth.signOut()
      .then(data => this.user$.next(null))
      .catch(err => console.log(err));
  }

  async update(user: User): Promise<any> {

    // session variable?
    // Purpose: update the details of a user who have already been registered

    console.log(this.user$.value);

    // Update user in App DB
    const userDB = {
      input: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    }

    const response = API.graphql(
      graphqlOperation(updateUser, userDB)
    );

    console.log('graphql: ', response);
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

  // NEED TEST
  async isUserReady(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getUser$()
        .pipe(timeout(2500))
        .subscribe((user: User) => {
          if (user) {
            resolve(user);
          }
        }, error => {
          reject(error);

        });
    });
  }

}
