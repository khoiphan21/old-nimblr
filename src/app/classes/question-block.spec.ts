import { BlockType, QuestionType } from 'src/API';
import { QuestionBlock} from './question-block';
const uuidv4 = require('uuid/v4');

describe('QuestionBlock -', () => {
  const input = {
    id: uuidv4(),
    type: BlockType.QUESTION,
    version: uuidv4(),
    documentId: uuidv4(),
    lastUpdatedBy: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    question: 'Is this a test value?',
    answers: null,
    questionType: null,
    options: null
  };

  beforeEach(() => {
    input.options = null;
  });

  it('should throw error if question type is not supported', () => {
    input.questionType = 'abcd';
    try {
      const block = new QuestionBlock(input);
    } catch (error) {
      expect(error.message).toEqual('QuestionType not supported');
    }
  });

  it('should set the right value for `question`', () => {
    input.question = 'This is a question';
    input.answers = ['answer'];
    const block = new QuestionBlock(input);
    const questionBlock: QuestionBlock = block as QuestionBlock;
    expect(questionBlock.question).toEqual('This is a question');
  });

  it('should set the right value for `questionType`', () => {
    input.questionType = QuestionType.PARAGRAPH;
    const block = new QuestionBlock(input);
    const questionBlock: QuestionBlock = block as QuestionBlock;
    expect(questionBlock.questionType).toEqual(QuestionType.PARAGRAPH);
  });

  it('should set the right value for `options`', () => {
    input.questionType = QuestionType.CHECKBOX;
    input.answers = ['this is the answer 1'];
    input.options = ['this is the answer 1', 'this is the answer 2'];
    const block = new QuestionBlock(input);
    const questionBlock: QuestionBlock = block as QuestionBlock;
    expect(questionBlock.options[0]).toEqual('this is the answer 1');
  });

  it('should set the right value for `answers` ', () => {
    input.questionType = QuestionType.CHECKBOX;
    input.answers = ['this is the answer 2'];
    input.options = ['this is the answer 2'];
    const block = new QuestionBlock(input);
    const questionBlock: QuestionBlock = block as QuestionBlock;
    expect(questionBlock.answers[0]).toEqual('this is the answer 2');
  });

  describe('PARAGRAPH & SHORT_ANSWER type -', () => {
    it('should not have `options` if it is PARAGRAPH type', () => {
      input.questionType = QuestionType.PARAGRAPH;
      input.options = ['this is the answer 1'];
      try {
        const block = new QuestionBlock(input);
        fail(`Error must be thrown for invalid properties`);
      } catch (error) {
        expect(error.message).toEqual(`Options should not exist in PARAGRAPH type`);
      }
    });

    it('should not have `options` if it is SHORT ANSWER type', () => {
      input.questionType = QuestionType.SHORT_ANSWER;
      input.options = ['this is the answer 1'];
      try {
        const block = new QuestionBlock(input);
        fail(`Error must be thrown for invalid properties`);
      } catch (error) {
        expect(error.message).toEqual(`Options should not exist in SHORT_ANSWER type`);
      }
    });
  });

  describe('CHECKBOX type -', () => {
    it('numbers of `answers` should not be more than `options`', () => {
      input.questionType = QuestionType.CHECKBOX;
      input.answers = ['this is the answer 1', 'this is the answer 2'];
      input.options = ['this is the answer 1'];
      try {
        const block = new QuestionBlock(input);
        fail(`Error must be thrown for invalid properties`);
      } catch (error) {
        expect(error.message).toEqual('numbers of `answers` should not be more than `options` in CHECKBOX');
      }
    });
  });

  describe('MULTIPLE_CHOICE type -', () => {

    it('options` should not be empty if answers exists`', () => {
      input.questionType = QuestionType.MULTIPLE_CHOICE;
      input.answers = ['this is the answer 1'];
      input.options = [];
      try {
        const block = new QuestionBlock(input);
        fail(`Error must be thrown for invalid properties`);
      } catch (error) {
        expect(error.message).toEqual('`options` should not be empty in MULTIPLE_CHOICE if answers exists');
      }
    });
  });
});
