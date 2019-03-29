import { Block } from './block';
import { UUID, ISOTimeString } from '../services/document/command/document-command.service';
import { BlockType, QuestionType } from '../../API';
import { isValidDateString } from './test-helpers.spec';

const BASE_ERROR_MESSAGE = 'QuestionBlock failed to create: ';

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
  private immutableAnswers: Array<string>;
  readonly questionType: QuestionType;
  readonly immutableOptions?: Array<string>;

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
    // Parameter validation
    this.checkQuestionType(questionType);
    this.validateTimeString({ createdAt, updatedAt }, ['createdAt', 'updatedAt']);
    const { newAnswers, newOptions } = this.processOptionsAndAnswers(
      { options, answers }
    );

    // Storing values
    this.id = id;
    this.version = version;
    this.type = type;
    this.documentId = documentId;
    this.lastUpdatedBy = lastUpdatedBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.question = question;
    this.immutableAnswers = newAnswers;
    this.questionType = questionType;
    this.immutableOptions = newOptions;
  }

  private checkQuestionType(questionType: any) {
    if (!Object.values(QuestionType).includes(questionType)) {
      throw new Error('QuestionType not supported');
    }
  }

  private validateTimeString(input: any, properties: Array<string>) {
    properties.forEach(property => {
      if (!isValidDateString(input[property])) {
        const detail = `${property} must be a valid time string`;
        throw new Error(BASE_ERROR_MESSAGE + detail);
      }
    });
  }

  private processOptionsAndAnswers({ options = [], answers = []}): OptionsAnswers {
    options = options ? options : [];
    answers = answers ? answers : [];

    const newOptions = options;
    const newAnswers = [];

    for (const answer of answers) {
      if (options.includes(answer)) {
        newAnswers.push(answer);
      }
    }
    return { newAnswers, newOptions };
  }

  get answers(): Array<string> {
    const list = [];
    for (const answer of this.immutableAnswers) {
      list.push(answer);
    }
    return list;
  }

  get options(): Array<string> {
    const list = [];
    for (const option of this.immutableOptions) {
      list.push(option);
    }
    return list;
  }

}

interface OptionsAnswers {
  newOptions: Array<string>;
  newAnswers: Array<string>;
}
