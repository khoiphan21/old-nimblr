import { Document } from './document';
import { UUID, ISOTimeString } from '../../services/document/command/document-command.service';
import { DocumentType, SharingStatus, SubmissionStatus } from 'src/API';
import { CreateDocumentInput } from '../../../API';
import { isValidDateString } from '../isValidDateString';
import { isUuid } from '../helpers';

const uuidv4 = require('uuid/v4');

/**
 * A Document object that will automatically validate its own internal
 * properties upon creation. If a value in the input is not given, it will be
 * set to a certain default value. Read the constructor() for more details
 */
export class DocumentImpl implements Document {
  // tslint:disable:variable-name
  protected baseErrorMessage: string;

  // To store the given constructor input for convenience
  private input: CreateDocumentInput;

  private _id: UUID;
  private _version: UUID;
  private _type: DocumentType;
  private _title: string;
  private _ownerId: UUID;
  private _editorIds: Array<UUID>;

  private _viewerIds: Array<UUID>;

  private _blockIds: Array<UUID>;

  private _lastUpdatedBy: UUID;

  private _createdAt: ISOTimeString;

  private _updatedAt: ISOTimeString;

  private _sharingStatus: SharingStatus;

  constructor(input: CreateDocumentInput) {
    // setup the error message
    this.baseErrorMessage = `${this.constructor.name} failed to create: `;

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
  }

  /**
   * Set the **internal property** to be the given default value, if the property
   * in the input is either *null* or *undefined*
   *
   * @param input the input given to instantiate this object
   * @param name the name of the property to be set
   * @param defaultValue the default value to be used
   */
  protected setIfNullOrUndefined(name: string, defaultValue: any) {
    const input = this.input;

    // Note: the '_' is needed since they are private variables with getters
    if (input[name] === null || input[name] === undefined) {
      this[`_${name}`] = defaultValue;
    } else {
      this[`_${name}`] = input[name];
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
      throw new Error(this.baseErrorMessage + `"${property}" must be a valid uuid`);
    }
  }

  private checkIfValidEnum(property: string, enumType: any, enumName: string) {
    if (!Object.keys(enumType).includes(this[property])) {
      const message = `"${property}" must be a valid value of ${enumName}`;
      throw new Error(this.baseErrorMessage + message);
    }
  }

  private checkIfString(property: string) {
    if (typeof this[property] !== 'string') {
      throw new Error(this.baseErrorMessage + `${property} must be a string`);
    }
  }

  private checkIfValidUuidArray(property: string) {
    if (!(this[property] instanceof Array)) {
      throw new Error(this.baseErrorMessage + `"${property}" must be an array`);
    }
    const array = this[property] as Array<UUID>;
    array.forEach(value => {
      if (!isUuid(value)) {
        const message = `"${property}" must contain only UUIDs`;
        throw new Error(this.baseErrorMessage + message);
      }
    });
  }

  protected checkIfValidDateString(property: string) {
    if (!isValidDateString(this[property])) {
      const message = `"${property}" must be a valid date string`;
      throw new Error(this.baseErrorMessage + message);
    }
  }

  /**
   * GETTERS
   */
  public get id(): UUID {
    return this._id;
  }
  public get version(): UUID {
    return this._version;
  }
  public get type(): DocumentType {
    return this._type;
  }
  public get title(): string {
    return this._title;
  }
  public get ownerId(): UUID {
    return this._ownerId;
  }
  public get editorIds(): Array<UUID> {
    return this._editorIds;
  }
  public get viewerIds(): Array<UUID> {
    return this._viewerIds;
  }
  public get blockIds(): Array<UUID> {
    return this._blockIds;
  }
  public get lastUpdatedBy(): UUID {
    return this._lastUpdatedBy;
  }
  public get createdAt(): ISOTimeString {
    return this._createdAt;
  }
  public get updatedAt(): ISOTimeString {
    return this._updatedAt;
  }
  public get sharingStatus(): SharingStatus {
    return this._sharingStatus;
  }
}
