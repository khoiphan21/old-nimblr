import { Block } from './block';
import { UUID, ISOTimeString } from '../services/document/command/document-command.service';
import { BlockType } from 'src/API';

export enum QuestionType {
    PARAGRAPH = 'PARAGRAPH',
    SHORT_ANSWER = 'SHORT_ANSWER',
    CHECKBOX = 'CHECKBOX',
    DROPDOWN = 'DROPDOWN',
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

export interface QuestionBlock extends Block {
    readonly id: UUID;
    readonly version: UUID;
    readonly type: BlockType;
    readonly documentId: UUID;
    readonly lastUpdatedBy: UUID;
    readonly createdAt: ISOTimeString;
    readonly updatedAt: ISOTimeString;
    readonly questionType: QuestionType;
    readonly question: string;
}

export class CheckboxQuestionBlock implements QuestionBlock {
    readonly id: UUID;
    readonly version: UUID;
    readonly type: BlockType;
    readonly documentId: UUID;
    readonly lastUpdatedBy: UUID;
    readonly createdAt: ISOTimeString;
    readonly updatedAt: ISOTimeString;
    readonly questionType: QuestionType;
    readonly question: string;
    readonly options: [];

    constructor({
      id,
      version,
      documentId,
      lastUpdatedBy,
      updatedAt,
      createdAt,
      questionType,
      question,
      options
    }) {
      this.id = id;
      this.version = version;
      this.documentId = documentId;
      this.type = BlockType.TEXT;
      this.lastUpdatedBy = lastUpdatedBy;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.questionType = questionType;
      this.question = question;
      this.options = options;
    }
  }
