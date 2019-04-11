import { DocumentImpl } from './document-impl';
import { CreateDocumentInput, SubmissionStatus, DocumentType } from 'src/API';
import { Document } from './document';
import { ISOTimeString } from 'src/app/services/document/command/document-command.service';
import { isValidDateString } from '../isValidDateString';

export class SubmissionDocument extends DocumentImpl implements Document {
  // tslint:disable:variable-name
  private _recipientEmail: string;
  private _submittedAt: ISOTimeString;
  private _submissionStatus: SubmissionStatus;

  constructor(input: CreateDocumentInput) {
    const {type, ...rest} = input;
    super({
      type: DocumentType.SUBMISSION,
      ...rest
    });

    this.setIfNullOrUndefined('recipientEmail', '');
    this.setIfNullOrUndefined('submittedAt', null);
    this.setIfNullOrUndefined('submissionStatus', SubmissionStatus.NOT_STARTED);
    this.validateSubmissionProperties();
  }

  private validateSubmissionProperties() {
    // Set the submissionStatus to NOT_STARTED if an invalid value
    if (!Object.keys(SubmissionStatus).includes(this.submissionStatus)) {
      this._submissionStatus = SubmissionStatus.NOT_STARTED;
    }
    // Throw error if submittedAt is not a valid date string
    if (!isValidDateString(this.submittedAt)) {
      const message = 'submittedAt must be a valid date string';
      throw new Error(this.baseErrorMessage + message);
    }
  }

  public get recipientEmail(): string {
    return this._recipientEmail;
  }
  public get submittedAt(): ISOTimeString {
    return this._submittedAt;
  }
  public get submissionStatus(): SubmissionStatus {
    return this._submissionStatus;
  }

}
