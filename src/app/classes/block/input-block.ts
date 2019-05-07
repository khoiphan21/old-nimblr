import { Block, BlockImpl } from './block';
import { UUID, ISOTimeString } from '../../services/document/command/document-command.service';
import { BlockType, InputType } from '../../../API';

const BASE_ERROR_MESSAGE = 'InputBlock failed to create: ';

interface OptionsAnswers {
  newOptions: Array<string>;
  newAnswers: Array<string>;
}

/**
 * A type of block to store data for a input and its answers.
 *
 * All properties of this class are immutable, including arrays.
 */
export class InputBlock extends BlockImpl implements Block {
  readonly id: UUID;
  readonly version: UUID;
  readonly type: BlockType;
  readonly documentId: UUID;
  readonly lastUpdatedBy: UUID;
  readonly createdAt: ISOTimeString;
  readonly updatedAt: ISOTimeString;
  // Input Block specific
  private immutableAnswers: Array<string>;
  readonly inputType: InputType;
  private immutableOptions?: Array<string>;
  readonly isLocked: boolean;

  constructor({
    id,
    version,
    documentId,
    lastUpdatedBy,
    createdAt,
    updatedAt,
    answers,
    inputType,
    options,
    isLocked
  }) {
    super({
      id,
      type: BlockType.INPUT,
      version,
      documentId,
      lastUpdatedBy,
      updatedAt,
      createdAt,
    });
    // Parameter validation
    this.checkinputType(inputType);
    const { newAnswers, newOptions } = this.processOptionsAndAnswers(
      { options, answers }
    );

    // Storing values
    this.immutableAnswers = newAnswers;
    this.inputType = inputType;
    this.immutableOptions = newOptions;
    this.isLocked = isLocked;
  }

  private checkinputType(inputType: any) {
    if (!Object.values(InputType).includes(inputType)) {
      throw new Error(BASE_ERROR_MESSAGE + 'InputType not supported');
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
      if (options.length > 0) {
        if (options.includes(answer)) {
          newAnswers.push(answer);
        }
      } else {
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
      if (typeof item !== 'string' && item !== null) {
        throw new Error(BASE_ERROR_MESSAGE + `"${name}" must contain only strings`);
      }
    });
  }

  /**
   * Retrieve a **copy** of the list of answers in this input block
   */
  get answers(): Array<string> {
    return this.immutableAnswers.map(value => value);
  }

  /**
   * Retrieve a **copy** of the list of options in this input block
   */
  get options(): Array<string> {
    return this.immutableOptions.map(value => value);
  }

}
