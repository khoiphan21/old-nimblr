import { Injectable } from '@angular/core';
import { CreateDocumentInput, DocumentType, UpdateDocumentInput } from '../../../API';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { createDocument, updateDocument } from '../../../graphql/mutations';
import { isUuid } from 'src/app/classes/helpers';
import { DocumentQueryService } from './document-query.service';

export type UUID = string;
export type ISOTimeString = string;

export interface UpdateFormDocumentInput {
  id: UUID;
  title: string;
  version: UUID;
  lastUpdatedBy: UUID;
  updatedAt: ISOTimeString;
  type?: DocumentType | null;
  ownerId?: UUID | null;
  editorIds?: Array< UUID | null > | null;
  viewerIds?: Array< UUID | null > | null;
  order?: Array< string | null > | null;
  blockIds?: Array< UUID | null > | null;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentCommandService {

  constructor(
    private graphQlService: GraphQLService,
    private queryService: DocumentQueryService
  ) { }

  async createDocument(input: CreateDocumentInput): Promise<any> {
    try {
      this.validateCreateInput(input);

      const response: any = await this.graphQlService.query(createDocument, { input });
      return Promise.resolve(response.data.createDocument);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private validateCreateInput(input: any) {
    this.checkIfMissing(input.type, 'type');
    switch (input.type) {
      case DocumentType.FORM:
        this.validateCreateInputForForm(input);
        return;
    }
  }

  private checkIfMissing(input: any, propertyName) {
    if (!input) {
      throw new Error(`Invalid parameter: Missing argument "${propertyName}"`);
    }
  }

  private validateCreateInputForForm(input: any) {
    // Check for general missing arguments
    const requiredArgs = [
      'version', 'ownerId', 'lastUpdatedBy'
    ];
    requiredArgs.forEach(arg => {
      this.checkIfMissing(input[arg], arg);
    });

    // Check for values that should be uuids
    const shouldBeUuids = [
      'version', 'ownerId', 'lastUpdatedBy'
    ];
    this.checkIfUuid(input, shouldBeUuids);

    // Checks for some specific properties
    if (input.title === '') {
      throw new Error('Invalid parameter: Document title cannot be an empty string');
    }
  }

  private checkIfUuid(input, shouldBeUuids: Array<string>) {
    shouldBeUuids.forEach(arg => {
      if (!isUuid(input[arg])) {
        throw new Error(`Invalid parameter: ${arg} must be an uuid`);
      }
    });
  }

  async updateDocument(input: UpdateDocumentInput | UpdateFormDocumentInput): Promise<any> {
    try {
      this.validateUpdateInput(input as UpdateFormDocumentInput);

      // Update the list of versions to be ignored
      this.queryService.registerUpdateVersion(input.version);

      const response: any = await this.graphQlService.query(updateDocument, { input });
      return Promise.resolve(response.data.updateDocument);
    } catch (error) {
      console.error('DocummentCommandService failed to update document with input: ', input);
      return Promise.reject(error);
    }
  }

  private validateUpdateInput(input: UpdateFormDocumentInput) {
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

    // Checks for some specific properties
    if (input.title === '') {
      throw new Error('Invalid parameter: Document title cannot be an empty string');
    }
  }
}
