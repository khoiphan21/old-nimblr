import { Document } from './document';
import { UUID, ISOTimeString } from '../../services/document/command/document-command.service';
import { DocumentType, SharingStatus, SubmissionStatus } from 'src/API';
import { CreateDocumentInput } from '../../../API';
import { isValidDateString } from '../isValidDateString';
import { isUuid } from '../helpers';

const uuidv4 = require('uuid/v4');

const BASE_ERROR_MESSAGE = 'DocumentImpl failed to create: ';

/**
 * A Document object that will automatically validate its own internal
 * properties upon creation. If a value in the input is not given, it will be
 * set to a certain default value. Read the constructor() for more details
 */
export class DocumentImpl implements Document {
  // To store the given constructor input for convenience
  private input: CreateDocumentInput;

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
  private _submissionDocIds: Array<UUID>;

  // Properties for the Submission Details section
  isSubmission: boolean;
  recipientEmail: string;
  submittedAt: ISOTimeString;
  submissionStatus: SubmissionStatus;

  constructor(input: CreateDocumentInput) {
    // Store the given input for other internal functions
    this.input = input;

    this.setIfNullOrUndefined('id', uuidv4());
    this.setIfNullOrUndefined('version', uuidv4());
    this.setIfNullOrUndefined('type', DocumentType.GENERIC);
    this.setIfNullOrUndefined('title', '');
    this.setIfNullOrUndefined('ownerId', uuidv4());
    this.setIfNullOrUndefined('editorIds', []);
    this.setIfNullOrUndefined('viewerIds', []);
    this.setIfNullOrUndefined('blockIds', []);
    this.setIfNullOrUndefined('lastUpdatedBy', uuidv4());
    this.setIfNullOrUndefined('createdAt', new Date().toISOString());
    this.setIfNullOrUndefined('updatedAt', new Date().toISOString());
    this.setIfNullOrUndefined('sharingStatus', SharingStatus.PRIVATE);

    // Now call a method to validate internal data and throw error if any
    // given value is invalid
    this.validateInternalData();

    // For the TEMPLATE type documents
    const submissionDocIds = input.submissionDocIds;
    if (submissionDocIds === null || submissionDocIds === undefined) {
      this._submissionDocIds = [];
    } else {
      // now make sure to store the submissionDocIds as a clone
      this._submissionDocIds = submissionDocIds.map(v => v);
    }

    // For the Submission Details section
    this.setIfNullOrUndefined('isSubmission', false);
    if (input.isSubmission === true) {
      this.setIfNullOrUndefined('recipientEmail', '');
      this.setIfNullOrUndefined('submittedAt', null);
      this.setIfNullOrUndefined('submissionStatus', SubmissionStatus.NOT_STARTED);
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
  private setIfNullOrUndefined(name: string, defaultValue: any) {
    const input = this.input;

    if (input[name] === null || input[name] === undefined) {
      this[name] = defaultValue;
    } else {
      this[name] = input[name];
    }
  }

  private validateInternalData() {
    // Check for properties that must be uuids
    ['id', 'version', 'ownerId', 'lastUpdatedBy'].forEach(property => {
      this.checkIfUuid(property);
    });

    this.checkIfValidEnum('type', DocumentType, 'DocumentType');

    this.checkIfString('title');

    // Check for properties that must be an array of uuids
    ['editorIds', 'viewerIds', 'blockIds'].forEach(property => {
      this.checkIfValidUuidArray(property);
    });

    // Check for properties that must be date strings
    ['createdAt', 'updatedAt'].forEach(property => {
      this.checkIfValidDateString(property);
    });

    this.checkIfValidEnum('sharingStatus', SharingStatus, 'SharingStatus');
  }

  private checkIfUuid(property: string) {
    if (!isUuid(this[property])) {
      throw new Error(BASE_ERROR_MESSAGE + `"${property}" must be a valid uuid`);
    }
  }

  private checkIfValidEnum(property: string, enumType: any, enumName: string) {
    if (!Object.keys(enumType).includes(this[property])) {
      console.log(enumType.constructor.name);
      const message = `"${property}" must be a valid value of ${enumName}`;
      throw new Error(BASE_ERROR_MESSAGE + message);
    }
  }

  private checkIfString(property: string) {
    if (typeof this[property] !== 'string') {
      throw new Error(BASE_ERROR_MESSAGE + `${property} must be a string`);
    }
  }

  private checkIfValidUuidArray(property: string) {
    if (!(this[property] instanceof Array)) {
      throw new Error(BASE_ERROR_MESSAGE + `"${property}" must be an array`);
    }
    const array = this[property] as Array<UUID>;
    array.forEach(value => {
      if (!isUuid(value)) {
        const message = `"${property}" must contain only UUIDs`;
        throw new Error(BASE_ERROR_MESSAGE + message);
      }
    });
  }

  private checkIfValidDateString(property: string) {
    if (!isValidDateString(this[property])) {
      const message = `"${property}" must be a valid date string`;
      throw new Error(BASE_ERROR_MESSAGE + message);
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
