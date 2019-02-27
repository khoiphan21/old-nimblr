import { Observable } from 'rxjs';
import { User } from '../../classes/user';

export abstract class AccountService {
    abstract async registerCognitoUser(user: User, password: string): Promise<any>;
    abstract async registerAppUser(user: User, password: string, verificationCode: string): Promise<any>;
    abstract async login(email: string, password: string): Promise<any>;
    abstract logout(): Promise<any>;
    abstract update(user: User): Promise<any>;
    abstract getUser$(): Observable<User>;
    abstract isUserReady(): Promise<any>;
}
