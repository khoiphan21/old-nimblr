import { User } from '../user';
import { UUID, ISOTimeString } from '../../services/document/command/document-command.service';
import { DocumentType, SharingStatus, SubmissionStatus } from 'src/API';

export interface Document {
  readonly id: UUID;
  readonly version: UUID;
  readonly type: DocumentType;
  readonly title: string;
  readonly ownerId: UUID;
  readonly editorIds: Array<UUID>;
  readonly viewerIds: Array<UUID>;
  readonly blockIds: Array<UUID>;
  readonly lastUpdatedBy: UUID;
  readonly createdAt: ISOTimeString;
  readonly updatedAt: ISOTimeString;
  readonly sharingStatus: SharingStatus;
}
