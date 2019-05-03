import { Injectable } from '@angular/core';
import { AccountService, UnverifiedUser } from './account.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { User, CognitoSignUpUser } from '../../classes/user';

import { Auth, API, graphqlOperation } from 'aws-amplify';
import { take } from 'rxjs/operators';
import { UserFactoryService } from '../user/user-factory.service';

import { createUser, updateUser } from '../../../graphql/mutations';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { getUser } from '../../../graphql/queries';

@Injectable({
  providedIn: 'root'
})
export class AccountServiceImpl implements AccountService {
  private unverifiedUser: UnverifiedUser = null;
  private user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(
    private userFactory: UserFactoryService,
    private graphQLService: GraphQLService
  ) {
  }

  getUnverifiedUser(): UnverifiedUser {
    return this.unverifiedUser;
  }

  setUnverifiedUser(email: string, password: string) {
    this.unverifiedUser = { email, password };
  }

  async registerCognitoUser(user: CognitoSignUpUser): Promise<any> {
    return await Auth.signUp(user);
  }

  async registerAppUser(user: CognitoSignUpUser, userId: string): Promise<any> {
    // Sign in to Cognito to perform graphql
    await Auth.signIn(user.username, user.password);
    // Register in App DB
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
    // query GraphQL to create a new user
    const createdUser = await this.graphQLService.query(createUser, userDetails);

    await this.restoreSession();

    return createdUser;
  }

  async awsConfirmAccount(email: string, code: string): Promise<any> {
    // Note: this function can never be automatically tested, as it requires
    // manual checking of email address, which is a pain to automate for now.
    return Auth.confirmSignUp(email, code, {
      forceAliasCreation: true
    });
  }

  async login(username: string, password: string): Promise<User> {
    const cognitoUser = await Auth.signIn(username, password);

    const userId = cognitoUser.signInUserSession.idToken.payload.sub;

    const appUser = await this.getAppUser(userId);
    this.user$.next(appUser);

    return appUser;
  }

  async logout(): Promise<any> {
    await Auth.signOut();
    this.user$.next(null);
  }

  private async getAppUser(id: string): Promise<User> {
    const response: any = await this.graphQLService.query(getUser, { id });

    const rawUser = response.data.getUser;

    return this.userFactory.createUser(
      rawUser.id,
      rawUser.firstName,
      rawUser.lastName,
      rawUser.email
    );
  }

  async update(user: User): Promise<any> {
    const input = {
      input: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    };

    const cognitoUser = await Auth.currentAuthenticatedUser();

    await Auth.updateUserAttributes(cognitoUser, { email: user.email });

    return await API.graphql(graphqlOperation(updateUser, input));
  }

  getUser$(): Observable<User> {
    this.user$.pipe(take(1)).subscribe(user => {
      if (user === null) {
        // retrieve user from session
        this.restoreSession().then((loggedInUser: User) => {
          this.user$.next(loggedInUser);
        }).catch(() => {
          this.user$.error('User is not logged in');
        });
      }
    });
    return this.user$;
  }

  private async restoreSession(): Promise<User> {
    const data = await Auth.currentSession();
    const user = await this.getAppUser(data.getIdToken().payload.sub);
    this.user$.next(user);
    return user;
  }

  async isUserReady(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getUser$()
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
