import { Injectable } from '@angular/core';
import { CreateDocumentInput, DocumentType, UpdateDocumentInput } from '../../../../API';
import { GraphQLService } from '../../graphQL/graph-ql.service';
import { createDocument, updateDocument } from '../../../../graphql/mutations';
import { isUuid } from 'src/app/classes/helpers';
import { DocumentQueryService } from '../query/document-query.service';

export type UUID = string;
export type ISOTimeString = string;

const uuidv4 = require('uuid/v4');

@Injectable({
  providedIn: 'root'
})
export class DocumentCommandService {

  constructor(
    private graphQlService: GraphQLService,
    private queryService: DocumentQueryService
  ) { }

  async createDocument(input: CreateDocumentInput): Promise<any> {
    this.validateCreateInput(input);

    // Change title to null if an empty string
    if (input.title === '') {
      input.title = null;
    }

    const response: any = await this.graphQlService.query(createDocument, { input });

    return response.data.createDocument;
  }

  private validateCreateInput(input: any) {
    this.checkIfMissing(input.type, 'type');
    this.validateCreateInputGeneral(input);
  }

  private checkIfMissing(input: any, propertyName) {
    if (!input) {
      throw new Error(`Invalid parameter: Missing argument "${propertyName}"`);
    }
  }

  private validateCreateInputGeneral(input: any) {
    // Check for general missing arguments
    const requiredArgs = [
      'version', 'ownerId', 'lastUpdatedBy', 'sharingStatus'
    ];
    requiredArgs.forEach(arg => {
      this.checkIfMissing(input[arg], arg);
    });

    // Check for values that should be uuids
    const shouldBeUuids = [
      'version', 'ownerId', 'lastUpdatedBy'
    ];
    this.checkIfUuid(input, shouldBeUuids);
  }

  private checkIfUuid(input, shouldBeUuids: Array<string>) {
    shouldBeUuids.forEach(arg => {
      if (!isUuid(input[arg])) {
        throw new Error(`Invalid parameter: ${arg} must be an uuid`);
      }
    });
  }

  async updateDocument(input: UpdateDocumentInput): Promise<any> {
    try {
      // Automatically set some properties to prevent accidental values
      input.version = uuidv4(); // Must be new every time
      input.updatedAt = new Date().toISOString(); // The most recent time
      delete input.createdAt; // This should not be updated

      // Convert title to null if empty string
      input.title = input.title === '' ? null : input.title;

      this.validateUpdateInput(input);

      // Update the list of versions to be ignored
      this.queryService.registerUpdateVersion(input.version);

      const response: any = await this.graphQlService.query(updateDocument, { input });
      return response.data.updateDocument;
    } catch (error) {
      throw error;
    }
  }

  private validateUpdateInput(input: UpdateDocumentInput) {
    // Check for general missing arguments
    const requiredArgs = [
      'version', 'id', 'lastUpdatedBy', 'updatedAt'
    ];
    requiredArgs.forEach(arg => {
      this.checkIfMissing(input[arg], arg);
    });

    // Check for values that should be uuids
    const shouldBeUuids = [
      'id', 'version', 'lastUpdatedBy'
      // 'version', 'ownerId', 'lastUpdatedBy'
    ];
    this.checkIfUuid(input, shouldBeUuids);
  }
}
