import { Block } from './block';
import { UUID, ISOTimeString } from '../services/document/command/document-command.service';
import { BlockType, QuestionType } from '../../API';
export class QuestionBlock implements Block {
  readonly id: UUID;
  readonly version: UUID;
  readonly type: BlockType;
  readonly documentId: UUID;
  readonly lastUpdatedBy: UUID;
  readonly createdAt: ISOTimeString;
  readonly updatedAt: ISOTimeString;
  // Question Block specific
  readonly question: string;
  readonly answers: Array<string>;
  readonly questionType: QuestionType;
  readonly options?: Array<string>;

  constructor({
    id,
    version,
    type,
    documentId,
    lastUpdatedBy,
    createdAt,
    updatedAt,
    question,
    answers,
    questionType,
    options
  }) {
    this.id = id;
    this.version = version;
    this.type = type;
    this.documentId = documentId;
    this.lastUpdatedBy = lastUpdatedBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.question = question;
    this.answers = answers;
    this.questionType = questionType;
    this.options = options;
    this.checkQuestionBlockValidation(questionType, answers, options);
  }

  private checkQuestionBlockValidation(questionType: QuestionType, answers: Array<string>, options: Array<string>) {
    switch (questionType) {
      case QuestionType.PARAGRAPH:
        return this.validateSingleTextAnswerQuestion(questionType, options);
      case QuestionType.SHORT_ANSWER:
        return this.validateSingleTextAnswerQuestion(questionType, options);
      case QuestionType.CHECKBOX:
        return this.validateCheckbox(answers, options);
      case QuestionType.MULTIPLE_CHOICE:
        return this.validateMultipleChoice(answers, options);
      default:
        throw new Error('QuestionType not supported');
    }
  }

  private validateSingleTextAnswerQuestion(questionType: QuestionType, options: Array<string>) {
    if (options) {
      throw new Error(`Options should not exist in ${questionType} type`);
    }
  }

  private validateCheckbox(answers: Array<string>, options: Array<string>) {
    if (answers.length > options.length) {
      throw new Error('numbers of `answers` should not be more than `options` in CHECKBOX');
    }
  }

  private validateMultipleChoice(answers: Array<string>, options: Array<string>) {
    if (answers.length === 1) {
      if (options.length < 1) {
        throw new Error('`options` should not be empty in MULTIPLE_CHOICE if answers exists');
      }
    }
  }
}
