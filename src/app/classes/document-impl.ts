import { Document } from './document';
import { UUID, ISOTimeString } from '../services/document/command/document-command.service';
import { DocumentType, SharingStatus, SubmissionStatus } from 'src/API';
import { CreateDocumentInput } from '../../API';
import { isValidDateString } from './isValidDateString';

const BASE_ERROR_MESSAGE = 'DocumentImpl failed to create: ';

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

  // Properties for FORM_TEMPLATE document type
  // tslint:disable:variable-name
  private _submissionDocIds: Array<UUID>;

  // Properties for the Submission Details section
  isSubmission: boolean;
  recipientEmail: string;
  submittedAt: ISOTimeString;
  submissionStatus: SubmissionStatus;

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

    // For the FORM_TEMPLATE type documents
    const submissionDocIds = input.submissionDocIds;
    if (submissionDocIds === null || submissionDocIds === undefined) {
      this._submissionDocIds = [];
    } else {
      // now make sure to store the submissionDocIds as a clone
      this._submissionDocIds = submissionDocIds.map(v => v);
    }

    // For the Submission Details section
    this.setIfNullOrUndefined(input, 'isSubmission', false);
    if (input.isSubmission === true) {
      this.setIfNullOrUndefined(input, 'recipientEmail', '');
      this.setIfNullOrUndefined(input, 'submittedAt', null);
      this.setIfNullOrUndefined(input, 'submissionStatus', SubmissionStatus.NOT_STARTED);
      this.validateSubmissionProperties();
    }
  }

  /**
   * Set the **internal property** to be the given default value, if the property
   * in the input is either *null* or *undefined*
   *
   * @param input the input given to instantiate this object
   * @param name the name of the property to be set
   * @param defaultValue the default value to be used
   */
  private setIfNullOrUndefined(input: any, name: string, defaultValue: any) {
    if (input[name] === null || input[name] === undefined) {
      this[name] = defaultValue;
    } else {
      this[name] = input[name];
    }
  }

  private validateSubmissionProperties() {
    // Set the submissionStatus to NOT_STARTED if an invalid value
    if (!Object.keys(SubmissionStatus).includes(this.submissionStatus)) {
      this.submissionStatus = SubmissionStatus.NOT_STARTED;
    }
    // Throw error if submittedAt is not a valid date string
    if (!isValidDateString(this.submittedAt)) {
      const message = 'submittedAt must be a valid date string';
      throw new Error(BASE_ERROR_MESSAGE + message);
    }
  }

  get submissionDocIds(): Array<UUID> {
    // Make sure to return a clone only
    return this._submissionDocIds.map(v => v);
  }
}
