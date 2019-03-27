import { Document } from './document';
import { UUID, ISOTimeString } from '../services/document/command/document-command.service';
import { DocumentType, SharingStatus } from 'src/API';
import { CreateDocumentInput } from '../../API';

export class DocumentImpl implements Document {
  id: UUID;
  version: UUID;
  type: DocumentType;
  title: string;
  ownerId: UUID;
  editorIds: Array<UUID>;
  viewerIds: Array<UUID>;
  blockIds: Array<UUID>;
  lastUpdatedBy: UUID;
  createdAt: ISOTimeString;
  updatedAt: ISOTimeString;
  sharingStatus: SharingStatus;

  constructor(input: CreateDocumentInput) {
    this.id = input.id;
    this.version = input.version;
    this.type = input.type;
    this.title = input.title;
    this.ownerId = input.ownerId;
    this.setIfNullOrUndefined(input, 'editorIds', []);
    this.setIfNullOrUndefined(input, 'viewerIds', []);
    this.setIfNullOrUndefined(input, 'blockIds', []);
    this.lastUpdatedBy = input.lastUpdatedBy;
    this.setIfNullOrUndefined(input, 'createdAt', new Date().toISOString());
    this.setIfNullOrUndefined(input, 'updatedAt', new Date().toISOString());
    this.setIfNullOrUndefined(input, 'sharingStatus', null);
  }

  private setIfNullOrUndefined(input: any, name: string, defaultValue: any) {
    if (input[name] === null || input[name] === undefined) {
      this[name] = defaultValue;
    } else {
      this[name] = input[name];
    }
  }
}
