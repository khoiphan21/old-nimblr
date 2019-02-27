import { UserFactoryService } from './user-factory.service';
import { User } from 'src/app/classes/user';
import { UserImpl } from '../../classes/user-impl';

import { API, graphqlOperation } from 'aws-amplify';

import * as queries from '../../../graphql/queries';

export class UserFactoryServiceImpl implements UserFactoryService {
  createUser(
    id: string,
    firstName: string,
    lastName: string,
    email: string
  ): User {
    return new UserImpl(id, firstName, lastName, email);
  }

  async getUserFromIds(ids: Array<string>): Promise<Array<User>> {
    if (ids === null) { return []; }
    if (ids.length === 0) { return []; }

    try {
      const parameters = {
        filter: {
          or: ids.map(id => {
            return {
              id: { eq: id }
            };
          })
        }
      };

      const response: any = await API.graphql(
        graphqlOperation(queries.listUsers, parameters)
      );

      // Retrieve users from the backend
      const users: Array<User> = response.data.listUsers.items.map(rawUser => {
        return this.createUser(
          rawUser.id,
          rawUser.firstName,
          rawUser.lastName,
          rawUser.email
        );
      });
      return Promise.resolve(users);
    } catch (error) {
      Promise.reject(error);
    }
  }

}
