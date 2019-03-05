import { Injectable } from '@angular/core';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { BlockQueryService } from './block-query.service';
import { CreateBlockInput, UpdateBlockInput, CreateTextBlockInput, BlockType, UpdateTextBlockInput } from '../../../API';
import { createTextBlock, updateTextBlock } from '../../../graphql/mutations';

@Injectable({
  providedIn: 'root'
})
export class BlockCommandService {

  constructor(
    private graphQLService: GraphQLService,
    private blockQueryService: BlockQueryService
  ) { }

  /**
   * Update a block in the database given the input.
   * This will also notify BlockQueryService of the updated block's version
   * @param input the input to the update query
   */
  updateBlock(input: UpdateBlockInput | UpdateTextBlockInput): Promise<any> {
    switch (input.type) {
      case BlockType.TEXT:
        return this.updateTextBlock({
          id: input.id,
          documentId: input.documentId,
          version: input.version,
          lastUpdatedBy: input.lastUpdatedBy,
          updatedAt: new Date().toISOString(),
          value: input.value
        });
      default:
        return Promise.reject('BlockType not supported');
    }
  }

  private async updateTextBlock(input: UpdateTextBlockInput): Promise<any> {
    const requiredParams = [
      'id', 'documentId', 'version', 'lastUpdatedBy', 'updatedAt', 'value'
    ];
    try {
      this.checkForNullOrUndefined(input, requiredParams, 'UpdateTextBlockInput');

      this.blockQueryService.registerUpdateVersion(input.version);

      return this.graphQLService.query(updateTextBlock, { input });
    } catch (error) {
      return Promise.reject(error);
    }
  }


  /**
   * Create a block in the database based on the input.
   * This will also notify BlockQueryService of the created block's version
   * @param input the input to the create query
   */
  createBlock(input: CreateBlockInput | CreateTextBlockInput): Promise<any> {
    switch (input.type) {
      case BlockType.TEXT:
        return this.createTextBlock(input);
      default:
        return Promise.reject('BlockType not supported');
    }
  }

  private async createTextBlock(originalInput: CreateBlockInput): Promise<any> {
    const input = {
      id: originalInput.id,
      version: originalInput.version,
      type: originalInput.type,
      documentId: originalInput.documentId,
      lastUpdatedBy: originalInput.lastUpdatedBy,
      value: originalInput.value === '' ? null : originalInput.value,
    };
    const requiredParams = [
      'id', 'version', 'type', 'documentId', 'lastUpdatedBy'
    ];
    try {
      this.checkForNullOrUndefined(input, requiredParams, 'CreateTextBlockInput');

      this.blockQueryService.registerUpdateVersion(input.version);

      return this.graphQLService.query(createTextBlock, { input });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private checkForNullOrUndefined(input: any, paramNames: Array<string>, context: string) {
    paramNames.forEach(param => {
      const value = input[param];
      if (value === undefined || value === null) {
        throw new Error(`Missing argument "${param}" in ${context}`);
      }
    });
  }
}
