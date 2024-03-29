import { UUID } from '../services/document/command/document-command.service';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface CognitoSignUpUser {
    username: string;
    password: string;
    attributes: CognitoUserAttributes;
}

export interface CognitoUserAttributes {
    email: string;
    given_name: string;
    family_name: string;
}

export type UserId = UUID;
