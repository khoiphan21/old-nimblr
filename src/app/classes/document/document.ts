import { User } from '../user';
import { UUID, ISOTimeString } from '../../services/document/command/document-command.service';
import { DocumentType, SharingStatus, SubmissionStatus } from 'src/API';

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
  sharingStatus: SharingStatus;
  // Properties for TEMPLATE document type
  // tslint:disable:variable-name
  readonly submissionDocIds: Array<UUID>;

  // Properties for the Submission Details section
  isSubmission: boolean;
  recipientEmail: string;
  submittedAt: ISOTimeString;
  submissionStatus: SubmissionStatus;
}
