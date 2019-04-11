import { Injectable } from '@angular/core';
import { Block } from '../../../classes/block/block';
import { TextBlock, CreateAppTextBlockInput } from '../../../classes/block/textBlock';
import { isUuid } from 'src/app/classes/helpers';
import { BlockType, QuestionType, TextBlockType } from '../../../../API';
import { QuestionBlock } from 'src/app/classes/block/question-block';
import { UUID } from '../../document/command/document-command.service';
import { HeaderBlock } from 'src/app/classes/block/textBox/header-block';

const uuidv4 = require('uuid/v4');

export interface CreateNewBlockInput {
  documentId: UUID;
  lastUpdatedBy: UUID;
}

@Injectable({
  providedIn: 'root'
})
export class BlockFactoryService {

  constructor() { }

  createNewTextBlock(input: CreateNewBlockInput): TextBlock {
    const newInput: CreateAppTextBlockInput = {
      documentId: input.documentId,
      lastUpdatedBy: input.lastUpdatedBy,
      value: '',
      textblocktype: null,
    };
    return new TextBlock(newInput);
  }

  createNewHeaderBlock(input: CreateNewBlockInput): HeaderBlock {
    const newInput: CreateAppTextBlockInput = {
      documentId: input.documentId,
      lastUpdatedBy: input.lastUpdatedBy,
      value: '',
      textblocktype: TextBlockType.HEADER,
    };

    return new HeaderBlock(newInput);
  }

  /**
   * Create a new QuestionBlock object. The parameters specified
   * are the minimum number of parameters required to create this
   * type of block.
   *
   * @returns a valid QuestionBlock object
   */
  createNewQuestionBlock(input: CreateNewBlockInput): QuestionBlock {
    const newInput = {
      id: uuidv4(),
      version: uuidv4(),
      type: BlockType.QUESTION,
      documentId: input.documentId,
      lastUpdatedBy: input.lastUpdatedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      question: '',
      answers: [],
      questionType: QuestionType.SHORT_ANSWER,
      options: []
    };
    return new QuestionBlock(newInput);
  }

  /**
   * Create a Block object from the given raw data. All parameters must not be
   * undefined or null. 'type', 'documentId' and 'lastUpdatedBy' must not be
   * undefined, but the other values will be automatically generated if not given
   *
   * @param param0 an object with options to create a block
   */
  createAppBlock({
    id = uuidv4(),
    type,
    version = uuidv4(),
    documentId,
    lastUpdatedBy,
    value = '',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
    question = '',
    answers = [],
    questionType = QuestionType.SHORT_ANSWER,
    options = []
  }): Block {
    const input = {
      id, type, version, documentId, lastUpdatedBy,
      value, updatedAt, createdAt, question, answers, questionType, options
    };

    ['id', 'type', 'version', 'documentId', 'lastUpdatedBy', 'createdAt',
      'updatedAt'
    ].forEach(paramName =>
      this.checkForNullOrUndefined(input[paramName], paramName)
    );

    // TODO MODIFY THIS TO ALLOW lastUpdatedBy to not be uuid
    // lastUpdatedBy MUST be either a uuid, or 'ANONYMOUS'
    ['id', 'version', 'documentId', 'lastUpdatedBy'].forEach(paramName => {
      this.checkIfUuid(input[paramName], paramName);
    });

    ['createdAt', 'updatedAt'].forEach(paramName => {
      this.checkIfValidTimeString(input[paramName], paramName);
    });

    switch (type) {
      case BlockType.TEXT:
        return new TextBlock(input);
      case BlockType.QUESTION:
        return new QuestionBlock(input);
      default:
        throw new Error('BlockType not supported');
    }
  }

  private checkForNullOrUndefined(parameter, parameterName) {
    if (parameter === undefined) {
      throw new Error(`${parameterName} is missing`);
    } else if (parameter === null) {
      throw new Error(`${parameterName} cannot be null`);
    }
  }

  private checkIfUuid(parameter, parameterName) {
    if (!isUuid(parameter)) {
      const message = `${parameterName} must be an uuid`;
      throw new Error(message);
    }
  }

  private checkIfValidTimeString(parameter, parameterName) {
    const createdDate = new Date(parameter);
    if (`${createdDate}`.indexOf('Invalid Date') !== -1) {
      const message = `${parameterName} must be a valid time string`;
      throw new Error(message);
    }
  }
}
