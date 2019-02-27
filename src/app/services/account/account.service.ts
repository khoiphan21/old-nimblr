import { Observable } from 'rxjs';
import { User } from '../../classes/user';

export abstract class AccountService {
    abstract register(user: User): Observable<boolean>;
    abstract async login(email: string, password: string): Promise<any>;
    abstract logout(): void;
    abstract update(user: User): Promise<any>;
    abstract getUser$(): Observable<User>;
    abstract isUserReady(): Promise<any>;
}
