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
    firstName: string;
    lastName: string;
}

