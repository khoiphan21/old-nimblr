import { BlockType, QuestionType } from 'src/API';
import { QuestionBlock, ParagraphOption, ShortAnswerOption, MultiplceChoiceOption, CheckBoxOption } from './question-block';
const uuidv4 = require('uuid/v4');

fdescribe('QuestionBlock -', () => {
  const input = {
    id: uuidv4(),
    type: BlockType.QUESTION,
    version: uuidv4(),
    documentId: uuidv4(),
    lastUpdatedBy: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    question: 'Is this a test value?',
    questionType: null,
    options: null
  };

  describe('with existing values, should set the right content in `options` to different question type', () => {
    it('should set the right value for `options` if it exists', () => {
      input.options = [{ answer: 'this is the answer' }];
      input.questionType = QuestionType.PARAGRAPH;
      const block = new QuestionBlock(input);
      const questionBlock: QuestionBlock = block as QuestionBlock;
      expect(questionBlock.options[0]).toEqual({ answer: 'this is the answer' });
    });
  });

  describe('without existing value, should generate different content in `options` for different qustion type', () => {
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

    it('should be ParagraphOption type for `PARAGRAPH` type', () => {
      input.questionType = QuestionType.PARAGRAPH;
      const block = new QuestionBlock(input);
      const questionBlock: QuestionBlock = block as QuestionBlock;
      expect(questionBlock.options[0] instanceof ParagraphOption).toBe(true);
    });

    it('should be ShortAnswerOption type for `SHORT_ANSWER` type', () => {
      input.questionType = QuestionType.SHORT_ANSWER;
      const block = new QuestionBlock(input);
      const questionBlock: QuestionBlock = block as QuestionBlock;
      expect(questionBlock.options[0] instanceof ShortAnswerOption).toBe(true);
    });

    it('should be MultiplceChoiceOption type for `MULTIPLE_CHOICE` type', () => {
      input.questionType = QuestionType.MULTIPLE_CHOICE;
      const block = new QuestionBlock(input);
      const questionBlock: QuestionBlock = block as QuestionBlock;
      expect(questionBlock.options[0] instanceof MultiplceChoiceOption).toBe(true);
    });

    it('should be CheckBoxOption type for `CHECKBOX` type', () => {
      input.questionType = QuestionType.CHECKBOX;
      const block = new QuestionBlock(input);
      const questionBlock: QuestionBlock = block as QuestionBlock;
      expect(questionBlock.options[0] instanceof CheckBoxOption).toBe(true);
    });

  });
});
