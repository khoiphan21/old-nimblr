import { Injectable } from '@angular/core';
import { User } from 'src/app/classes/user';
import { UserImpl } from '../../classes/user-impl';

import { API, graphqlOperation } from 'aws-amplify';

import * as queries from '../../../graphql/queries';

@Injectable({
  providedIn: 'root'
})
export class UserFactoryService {
  createUser(
    id: string,
    firstName: string,
    lastName: string,
    email: string
  ): User {
    return new UserImpl(id, firstName, lastName, email);
  }

}
