import { Block, BlockImpl } from './block';
import { UUID, ISOTimeString } from '../../services/document/command/document-command.service';
import { BlockType, QuestionType } from '../../../API';

const BASE_ERROR_MESSAGE = 'QuestionBlock failed to create: ';

interface OptionsAnswers {
  newOptions: Array<string>;
  newAnswers: Array<string>;
}

/**
 * A type of block to store data for a question and its answers.
 *
 * All properties of this class are immutable, including arrays.
 */
export class QuestionBlock extends BlockImpl implements Block {
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
  private immutableOptions?: Array<string>;

  constructor({
    id,
    version,
    documentId,
    lastUpdatedBy,
    createdAt,
    updatedAt,
    question,
    answers,
    questionType,
    options
  }) {
    super({
      id,
      type: BlockType.QUESTION,
      version,
      documentId,
      lastUpdatedBy,
      updatedAt,
      createdAt,
    });
    // Parameter validation
    this.checkQuestionType(questionType);
    const { newAnswers, newOptions } = this.processOptionsAndAnswers(
      { options, answers }
    );

    // Storing values
    this.question = question === null ? '' : question;
    this.immutableAnswers = newAnswers;
    this.questionType = questionType;
    this.immutableOptions = newOptions;
  }

  private checkQuestionType(questionType: any) {
    if (!Object.values(QuestionType).includes(questionType)) {
      throw new Error(BASE_ERROR_MESSAGE + 'QuestionType not supported');
    }
  }

  private processOptionsAndAnswers({ options = [], answers = [] }): OptionsAnswers {
    options = options !== null ? options : [];
    answers = answers !== null ? answers : [];

    this.validateStringArray(options, 'options');
    this.validateStringArray(answers, 'answers');

    const newOptions = options;
    const newAnswers = [];

    for (const answer of answers) {
      if (options.includes(answer)) {
        newAnswers.push(answer);
      }
    }
    return { newAnswers, newOptions };
  }

  private validateStringArray(value, name) {
    if (value instanceof Array === false) {
      throw new Error(BASE_ERROR_MESSAGE + `"${name}" must be an array`);
    }
    const arrayValue = value as Array<any>;
    arrayValue.forEach(item => {
      if (typeof item !== 'string') {
        throw new Error(BASE_ERROR_MESSAGE + `"${name}" must contain only strings`);
      }
    });
  }

  /**
   * Retrieve a **copy** of the list of answers in this question block
   */
  get answers(): Array<string> {
    return this.immutableAnswers.map(value => value);
  }

  /**
   * Retrieve a **copy** of the list of options in this question block
   */
  get options(): Array<string> {
    return this.immutableOptions.map(value => value);
  }

}
