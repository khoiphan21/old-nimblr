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

  // createDocument({
  //   id,
  //   ownerId,
  //   title = null,
  //   version = uuidv4(),
  //   type = DocumentType.GENERIC,
  //   editorIds = [],
  //   viewerIds = [],
  //   blockIds = [],
  //   lastUpdatedBy = ownerId,
  //   createdAt = new Date().toUTCString(),
  //   updatedAt = new Date().toUTCString(),
  //   sharingStatus = null
  // }): Document {
  //   const input: CreateDocumentInput = {
  //     id, version, type, title, ownerId, editorIds, viewerIds,
  //     blockIds, lastUpdatedBy, createdAt, updatedAt, sharingStatus
  //   };

  //   this.checkForNullOrUndefined(input);

  //   return new DocumentImpl(input);
  // }

  // private checkForNullOrUndefined(input: any) {
  //   const requiredUuidParams = [
  //     'id', 'ownerId'
  //   ];
  //   requiredUuidParams.forEach(param => {
  //     if (!input[param]) {
  //       throw new Error(`Invalid parameter: missing ${param}`);
  //     } else if (!isUuid(input[param])) {
  //       throw new Error(`Invalid parameter: ${param} must be a uuid`);
  //     }
  //   });
  // }
}
