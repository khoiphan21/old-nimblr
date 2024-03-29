import { Injectable } from '@angular/core';
import { GraphQLService } from '../../graphQL/graph-ql.service';
import { BlockQueryService } from '../query/block-query.service';
/* tslint:disable:max-line-length */
import { CreateBlockInput, CreateTextBlockInput, BlockType, UpdateTextBlockInput, CreateInputBlockInput, UpdateInputBlockInput, DeleteBlockInput } from '../../../../API';
import { createTextBlock, updateTextBlock, createInputBlock, updateInputBlock, deleteBlock } from '../../../../graphql/mutations';
import { VersionService } from '../../version/version.service';

const uuidv4 = require('uuid/v4');

@Injectable({
  providedIn: 'root'
})
export class BlockCommandService {

  constructor(
    private graphQLService: GraphQLService,
    private versionService: VersionService
  ) { }

  /**
   * Update a block in the database given the input.
   * This will also notify BlockQueryService of the updated block's version
   * @param input the input to the update query
   */
  updateBlock(input: UpdateTextBlockInput | UpdateInputBlockInput): Promise<any> {
    // The version that this query will use, to prevent misuse of the version
    const version = uuidv4();
    // Register the version to the service
    this.versionService.registerVersion(version);

    switch (input.type) {
      case BlockType.TEXT:
        const textInput = input as UpdateTextBlockInput;
        return this.updateTextBlock({
          id: textInput.id,
          documentId: textInput.documentId,
          version,
          lastUpdatedBy: textInput.lastUpdatedBy,
          updatedAt: new Date().toISOString(),
          value: textInput.value,
          textBlockType: textInput.textBlockType,
        });

      case BlockType.INPUT:
        const inputInput = input as UpdateInputBlockInput;
        return this.updateInputBlock({
          id: inputInput.id,
          documentId: inputInput.documentId,
          version,
          lastUpdatedBy: inputInput.lastUpdatedBy,
          updatedAt: new Date().toISOString(),
          inputType: inputInput.inputType,
          answers: inputInput.answers,
          options: inputInput.options,
          isLocked: inputInput.isLocked
        });
      default:
        return Promise.reject('BlockType not supported');
    }
  }

  private async updateTextBlock(input: UpdateTextBlockInput): Promise<any> {
    const requiredParams = [
      'id', 'documentId', 'version', 'lastUpdatedBy', 'value'
    ];
    try {
      this.checkForNullOrUndefined(input, requiredParams, 'UpdateTextBlockInput');

      // Now do a convert for empty string in 'value'
      input.value = input.value === '' ? null : input.value;

      return this.graphQLService.query(updateTextBlock, { input });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async updateInputBlock(input: UpdateInputBlockInput): Promise<any> {
    const requiredParams = [
      'id', 'documentId', 'version', 'lastUpdatedBy', 'answers', 'inputType'
    ];
    try {
      this.checkForNullOrUndefined(input, requiredParams, 'UpdateInputBlockInput');

      input.options = this.cleanInputOptions(input.options);

      return this.graphQLService.query(updateInputBlock, { input });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private cleanInputOptions(options: Array<string>) {
    options = options === undefined ? null : options;
    if (options) {
      options.forEach((option, index) => {
        if (option === '') {
          options[index] = null;
        }
      });
    }
    return options;
  }

  /**
   * Create a block in the database based on the input.
   * This will also notify BlockQueryService of the created block's version
   * @param input the input to the create query
   */
  createBlock(input: CreateTextBlockInput | CreateInputBlockInput): Promise<any> {
    // reset the input's version to a new value
    input.version = uuidv4();

    switch (input.type) {
      case BlockType.TEXT:
        return this.createTextBlock(input);
      case BlockType.INPUT:
        return this.createInputBlock(input);
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
      value: originalInput.value,
      textBlockType: originalInput.textBlockType,
    };

    const requiredParams = [
      'id', 'version', 'type', 'documentId', 'lastUpdatedBy'
    ];

    try {
      this.checkForNullOrUndefined(input, requiredParams, 'CreateTextBlockInput');

      // Now do a convert for empty string in 'value'
      input.value = input.value === '' ? null : input.value;

      return this.graphQLService.query(createTextBlock, { input });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async createInputBlock(originalInput: CreateInputBlockInput): Promise<any> {
    const input = {
      id: originalInput.id,
      version: originalInput.version,
      type: originalInput.type,
      documentId: originalInput.documentId,
      lastUpdatedBy: originalInput.lastUpdatedBy,
      answers: originalInput.answers,
      inputType: originalInput.inputType,
      options: originalInput.options,
      isLocked: originalInput.isLocked
    };
    const requiredParams = [
      'id', 'version', 'type', 'documentId', 'lastUpdatedBy'
    ];
    try {
      this.checkForNullOrUndefined(input, requiredParams, 'createInputBlockInput');

      input.options = this.cleanInputOptions(input.options);

      return this.graphQLService.query(createInputBlock, { input });
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

  async deleteBlock(input: DeleteBlockInput): Promise<any> {
    // graphql delete block
    input = { id: input.id };
    const response = await this.graphQLService.query(deleteBlock, { input });

    return response;
  }

  async duplicateBlocks(inputs: Array<CreateBlockInput>): Promise<Array<CreateBlockInput>> {
    const promises = [];

    inputs.forEach(input => {
      promises.push(this.duplicateOneBlock(input));
    });

    return await Promise.all(promises);
  }

  private async duplicateOneBlock(input: CreateBlockInput): Promise<CreateBlockInput> {
    // Extract the required params
    const {
      // note: the id is left out so that a new id will be generated
      version,
      type,
      documentId,
      lastUpdatedBy,
      value,
      answers,
      inputType,
      options,
      textBlockType
    } = input;

    const response = await this.createBlock({
      id: uuidv4(),
      version,
      type,
      documentId,
      lastUpdatedBy,
      value,
      answers,
      inputType,
      options,
      textBlockType
    });

    switch (type) {
      case BlockType.TEXT:
        return response.data.createTextBlock;
      case BlockType.INPUT:
        return response.data.createInputBlock;
    }

  }
}
