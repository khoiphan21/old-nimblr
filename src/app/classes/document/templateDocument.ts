import { DocumentImpl } from './document-impl';
import { CreateDocumentInput, DocumentType } from 'src/API';
import { Document } from './document';
import { UUID } from 'src/app/services/document/command/document-command.service';



export class TemplateDocument extends DocumentImpl implements Document {

  // tslint:disable:variable-name
  private _submissionDocIds: Array<UUID>;

  constructor(input: CreateDocumentInput) {
    const {type, ...rest} = input;
    super({
      type: DocumentType.TEMPLATE, // change the type to always be template
      ...rest
    });

    // For the TEMPLATE type documents
    const submissionDocIds = input.submissionDocIds;
    if (submissionDocIds === null || submissionDocIds === undefined) {
      this._submissionDocIds = [];
    } else {
      // now make sure to store the submissionDocIds as a clone
      this._submissionDocIds = submissionDocIds.map(v => v);
    }
  }

  // For the TEMPLATE document type
  public get submissionDocIds(): Array<UUID> {
    // Make sure to return a clone only
    return this._submissionDocIds.map(v => v);
  }


}
