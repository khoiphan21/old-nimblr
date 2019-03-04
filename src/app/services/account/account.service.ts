import { Observable } from 'rxjs';
import { User, CognitoSignUpUser } from '../../classes/user';

export abstract class AccountService {
    abstract async registerCognitoUser(user: CognitoSignUpUser): Promise<any>;
    abstract async awsConfirmAccount(email: string, code: string): Promise<any>;
    abstract async registerAppUser(user: CognitoSignUpUser, userId: string, verificationCode: string): Promise<any>;
    abstract async login(email: string, password: string): Promise<any>;
    abstract logout(): Promise<any>;
    abstract update(user: User): Promise<any>;
    abstract getUser$(): Observable<User>;
    abstract isUserReady(): Promise<any>;
}
