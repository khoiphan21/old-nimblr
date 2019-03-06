import { Document } from './document';
import { UUID, ISOTimeString } from '../services/document/document-command.service';
import { DocumentType } from 'src/API';
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

  constructor(input: CreateDocumentInput) {
    this.id = input.id;
    this.version = input.version;
    this.type = input.type;
    this.title = input.title;
    this.ownerId = input.ownerId;
    this.editorIds = input.editorIds === null ? [] : input.editorIds;
    this.viewerIds = input.viewerIds === null ? [] : input.viewerIds;
    this.blockIds = input.blockIds === null ? [] : input.blockIds;
    this.lastUpdatedBy = input.lastUpdatedBy;
    this.createdAt = input.createdAt === null ? new Date().toISOString() : input.createdAt;
    this.updatedAt = input.updatedAt === null ? new Date().toISOString() : input.updatedAt;
  }
}
