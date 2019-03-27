import { Observable } from 'rxjs';
import { User, CognitoSignUpUser } from '../../classes/user';
export class UnverifiedUser {
    email: string;
    password: string;
  }

export abstract class AccountService {
    abstract getUnverifiedUser(): UnverifiedUser;
    abstract setUnverifiedUser(email: string, password: string);
    abstract async registerCognitoUser(user: CognitoSignUpUser): Promise<any>;
    abstract async awsConfirmAccount(email: string, code: string): Promise<any>;
    abstract async registerAppUser(user: CognitoSignUpUser, userId: string): Promise<any>;
    abstract async login(email: string, password: string): Promise<any>;
    abstract logout(): Promise<any>;
    abstract update(user: User): Promise<any>;
    abstract getUser$(): Observable<User>;
    abstract isUserReady(): Promise<User>;
}
