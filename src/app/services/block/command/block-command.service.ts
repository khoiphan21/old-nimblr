import { Injectable } from '@angular/core';
import { GraphQLService } from '../../graphQL/graph-ql.service';
import { BlockQueryService } from '../query/block-query.service';
/* tslint:disable:max-line-length */
import { CreateBlockInput, UpdateBlockInput, CreateTextBlockInput, BlockType, UpdateTextBlockInput, CreateQuestionBlockInput, UpdateQuestionBlockInput, DeleteBlockInput } from '../../../../API';
import { createTextBlock, updateTextBlock, createQuestionBlock, updateQuestionBlock, deleteBlock } from '../../../../graphql/mutations';
import { VersionService } from '../../version.service';

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
  updateBlock(input: UpdateTextBlockInput | UpdateQuestionBlockInput): Promise<any> {
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
          value: textInput.value
        });

      case BlockType.QUESTION:
        const questionInput = input as UpdateQuestionBlockInput;
        return this.updateQuestionBlock({
          id: questionInput.id,
          documentId: questionInput.documentId,
          version,
          lastUpdatedBy: questionInput.lastUpdatedBy,
          updatedAt: new Date().toISOString(),
          question: questionInput.question,
          questionType: questionInput.questionType,
          answers: questionInput.answers,
          options: questionInput.options
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

  private async updateQuestionBlock(input: UpdateQuestionBlockInput): Promise<any> {
    const requiredParams = [
      'id', 'documentId', 'version', 'lastUpdatedBy', 'answers', 'questionType'
    ];
    try {
      this.checkForNullOrUndefined(input, requiredParams, 'UpdateQuestionBlockInput');

      // Now do a convert for empty string in 'question'
      input.question = input.question === '' ? null : input.question;
      input.options = this.cleanQuestionOptions(input.options);

      return this.graphQLService.query(updateQuestionBlock, { input });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private cleanQuestionOptions(options: Array<string>) {
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
  // Why do you need `CreateBlockInput`
  // createBlock(input: CreateBlockInput | CreateTextBlockInput | CreateQuestionBlockInput): Promise<any> {
  createBlock(input: CreateTextBlockInput | CreateQuestionBlockInput): Promise<any> {
    switch (input.type) {
      case BlockType.TEXT:
        return this.createTextBlock(input);
      case BlockType.QUESTION:
        return this.createQuestionBlock(input);
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

  private async createQuestionBlock(originalInput: CreateQuestionBlockInput): Promise<any> {
    const input = {
      id: originalInput.id,
      version: originalInput.version,
      type: originalInput.type,
      documentId: originalInput.documentId,
      lastUpdatedBy: originalInput.lastUpdatedBy,
      question: originalInput.question,
      answers: originalInput.answers,
      questionType: originalInput.questionType,
      options: originalInput.options,
    };
    const requiredParams = [
      'id', 'version', 'type', 'documentId', 'lastUpdatedBy'
    ];
    try {
      this.checkForNullOrUndefined(input, requiredParams, 'CreateQuestionBlockInput');

      input.question = input.question === '' ? null : input.question;
      input.options = this.cleanQuestionOptions(input.options);

      return this.graphQLService.query(createQuestionBlock, { input });
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
}
