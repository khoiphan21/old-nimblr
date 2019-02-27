import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { User } from '../../classes/user';

import { Auth, API, graphqlOperation } from 'aws-amplify';
import { take, timeout, catchError } from 'rxjs/operators';

import * as queries from '../../../graphql/queries';
import { UserFactoryService } from '../user/user-factory.service';
import { Router } from '@angular/router';

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


  // Bruno
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

  logout(): void {

  }

  update(user: User): Promise<any> {

    return;
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
