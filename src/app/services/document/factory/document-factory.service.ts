import { Injectable } from '@angular/core';
import { DocumentImpl } from '../../../classes/document-impl';
import { Document } from 'src/app/classes/document';
import { DocumentType } from 'src/API';
import { CreateDocumentInput } from '../../../../API';
import { isUuid } from '../../../classes/helpers';

const uuidv5 = require('uuid/v5');

@Injectable({
  providedIn: 'root'
})
export class DocumentFactoryService {

  constructor() { }

  createDocument({
    id,
    ownerId,
    title = null,
    version = 'NOT SET',
    type = DocumentType.GENERIC,
    editorIds = [],
    viewerIds = [],
    blockIds = [],
    lastUpdatedBy = ownerId,
    createdAt = new Date().toUTCString(),
    updatedAt = new Date().toUTCString()
  }): Document {
    const input: CreateDocumentInput = {
      id, version, type, title, ownerId, editorIds, viewerIds,
      blockIds, lastUpdatedBy, createdAt, updatedAt
    };

    this.checkForNullOrUndefined(input);

    if (version === 'NOT SET') { version = uuidv5(id, ownerId); }

    return new DocumentImpl(input);
  }

  private checkForNullOrUndefined(input: any) {
    const requiredUuidParams = [
      'id', 'ownerId'
    ];
    requiredUuidParams.forEach(param => {
      if (!input[param]) {
        throw new Error(`Invalid parameter: missing ${param}`);
      } else if (!isUuid(input[param])) {
        throw new Error(`Invalid parameter: ${param} must be a uuid`);
      }
    });
  }
}
