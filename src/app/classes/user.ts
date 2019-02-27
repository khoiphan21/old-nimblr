export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export type CognitoSignUpUser = {
    username: string;
    password: string;
    attributes: CognitoUserAttributes;
};

export type CognitoUserAttributes = {
    email: string;
    given_name: string;
    family_name: string;
};
