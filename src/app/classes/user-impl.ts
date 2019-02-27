import { User } from './user';

export class UserImpl implements User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}
