import { User } from './user';
import { UUID, ISOTimeString } from '../services/document/document-command.service';
import { DocumentType } from 'src/API';

export interface Document {
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
}
