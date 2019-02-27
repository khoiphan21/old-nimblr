import { User } from './user';

export interface Document {
  id: string;
  type: DocumentType;
  title: string;
  owner: User;
  editors: Array<User>;
  viewers: Array<User>;
  order: Array<string>;
}

export enum DocumentType {
  GENERIC = 'GENERIC',
  FORM = 'FORM'
}
