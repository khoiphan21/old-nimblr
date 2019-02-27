import { User } from 'src/app/classes/user';

export abstract class UserFactoryService {

  abstract createUser(
    id: string,
    firstName: string,
    lastName: string,
    email: string
  ): User;

  abstract async getUserFromIds(ids: Array<string>): Promise<Array<User>>;
}
