import { Block, BlockCreateError } from './block';
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
    readonly question: string;
    readonly questionType: QuestionType;
    readonly options: Array<object>;

    constructor({
        id,
        version,
        type,
        documentId,
        lastUpdatedBy,
        createdAt,
        updatedAt,
        question,
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
        this.questionType = questionType;
        if (options) {
            this.options = options;
        } else {
            this.options = this.generateOptionsForQuestionType(questionType);
        }
    }

    private generateOptionsForQuestionType(questionType: QuestionType): Array<QuestionOption> {
        switch (questionType) {
            case QuestionType.PARAGRAPH:
                return [new ParagraphOption('')];
            case QuestionType.SHORT_ANSWER:
                return [new ShortAnswerOption('')];
            case QuestionType.MULTIPLE_CHOICE:
                return [new MultiplceChoiceOption('', '')];
            case QuestionType.CHECKBOX:
                return [new CheckBoxOption('', false)];
            default:
                throw new BlockCreateError(null, 'QuestionType not supported');
        }
    }
}


export interface QuestionOption {
    answer: string;
}

export class ParagraphOption implements QuestionOption {
    answer: string;
    constructor(
        answer: string,
    ) {
        this.answer = answer;
    }
}

export class ShortAnswerOption implements QuestionOption {
    answer: string;
    constructor(
        answer: string,
    ) {
        this.answer = answer;
    }
}

export class CheckBoxOption implements QuestionOption {
    checked: boolean;
    answer: string;
    constructor(
        answer: string,
        checked: boolean
    ) {
        this.answer = answer;
        this.checked = checked;
    }
}

export class MultiplceChoiceOption implements QuestionOption {
    selected: string;
    answer: string;
    constructor(
        answer: string,
        selected: string
    ) {
        this.answer = answer;
        this.answer = selected;
    }
}
