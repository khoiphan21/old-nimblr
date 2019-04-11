import { Injectable } from '@angular/core';
import { DocumentImpl } from '../../../classes/document/document-impl';
import { Document } from 'src/app/classes/document/document';
import { DocumentType } from 'src/API';
import { CreateDocumentInput } from '../../../../API';
import { UserId } from 'src/app/classes/user';
import { TemplateDocument } from 'src/app/classes/document/templateDocument';
import { SubmissionDocument } from 'src/app/classes/document/submissionDocument';

export interface NewDocumentInput {
  ownerId: UserId;
}

export interface NewSubmissionDocumentInput {
  recipientEmail: string;
  ownerId: UserId;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentFactoryService {

  constructor() { }

  createNewDocument(input: NewDocumentInput): Document {
    const newInput = input as any;

    newInput.lastUpdatedBy = input.ownerId;

    return new DocumentImpl(input);
  }

  createNewTemplateDocument(input: NewDocumentInput): Document {
    const newInput = input as any;

    // Set the default properties
    newInput.lastUpdatedBy = input.ownerId;

    return new TemplateDocument(newInput);
  }

  createNewSubmission(input: NewSubmissionDocumentInput): SubmissionDocument {
    // Extract the data from the original input
    const { ownerId, recipientEmail } = input;
    // update some properties
    const newInput: CreateDocumentInput = {
      ownerId, recipientEmail,
      lastUpdatedBy: input.ownerId
    };

    return new SubmissionDocument(newInput);
  }

  convertRawDocument(input: CreateDocumentInput): Document | TemplateDocument | SubmissionDocument {
    switch (input.type) {
      case DocumentType.GENERIC:
        return new DocumentImpl(input);
      case DocumentType.TEMPLATE:
        return new TemplateDocument(input);
      case DocumentType.SUBMISSION:
        return new SubmissionDocument(input);
      default:
        return new DocumentImpl(input);
    }
  }

}
