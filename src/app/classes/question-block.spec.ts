import { BlockType, QuestionType } from 'src/API';
import { QuestionBlock } from './question-block';
const uuidv4 = require('uuid/v4');

describe('QuestionBlock -', () => {
  let input: any;

  beforeEach(() => {
    input = {
      id: uuidv4(),
      type: BlockType.QUESTION,
      version: uuidv4(),
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      question: 'Is this a test value?',
      answers: [],
      questionType: QuestionType.SHORT_ANSWER,
      options: []
    };
  });

  // tslint:disable:no-unused-expression
  describe('Parameter Validation', () => {

    it('should throw an error if createdAt is not a valid time string', () => {
      input.createdAt = 'abcd';
      try {
        new QuestionBlock(input);
        fail('error must be thrown');
      } catch (error) {
        const detail = 'createdAt must be a valid time string';
        expect(error.message).toBe('QuestionBlock failed to create: ' + detail);
      }
    });
    it('should throw an error if updatedAt is not a valid time string', () => {
      input.updatedAt = 'abcd';
      try {
        new QuestionBlock(input);
        fail('error must be thrown');
      } catch (error) {
        const detail = 'updatedAt must be a valid time string';
        expect(error.message).toBe('QuestionBlock failed to create: ' + detail);
      }
    });
    it('should throw error if question type is not supported', () => {
      const input2 = input as any;
      input2.questionType = 'abcd';
      try {
        new QuestionBlock(input2);
      } catch (error) {
        expect(error.message).toEqual('QuestionType not supported');
      }
    });
  });

  describe('setting values', () => {

    it('should set the right value for `question`', () => {
      input.question = 'This is a question';
      input.answers = ['answer'];
      const questionBlock = new QuestionBlock(input);
      expect(questionBlock.question).toEqual('This is a question');
    });

    it('should set the right value for `questionType`', () => {
      input.questionType = QuestionType.PARAGRAPH;
      const questionBlock = new QuestionBlock(input);
      expect(questionBlock.questionType).toEqual(QuestionType.PARAGRAPH);
    });

    it('should set the right value for `options`', () => {
      input.questionType = QuestionType.CHECKBOX;
      input.answers = ['this is the answer 1'];
      input.options = ['this is the answer 1', 'this is the answer 2'];
      const questionBlock = new QuestionBlock(input);
      expect(questionBlock.options[0]).toEqual('this is the answer 1');
      expect(questionBlock.options[1]).toEqual('this is the answer 2');
    });

    it('should set the right value for `answers` ', () => {
      input.questionType = QuestionType.CHECKBOX;
      input.answers = ['this is the answer 2'];
      input.options = ['this is the answer 2'];
      const block = new QuestionBlock(input);
      expect(block.answers[0]).toEqual('this is the answer 2');
    });

    describe('handling "answers" and "options" arrays', () => {
      it('should remove any answers that are not in options', () => {
        input.questionType = QuestionType.CHECKBOX;
        input.answers = ['this is the answer 2', 'EXTRA'];
        input.options = ['this is the answer 2'];
        const questionBlock = new QuestionBlock(input);
        expect(questionBlock.answers.length).toBe(1);
        expect(questionBlock.answers[0]).toEqual('this is the answer 2');
      });
      it('should remove all answers if options is empty', () => {
        input.questionType = QuestionType.CHECKBOX;
        input.answers = ['this is the answer 2', 'EXTRA'];
        input.options = [];
        const questionBlock = new QuestionBlock(input);
        expect(questionBlock.answers.length).toBe(0);
      });

      describe('(null or empty)', () => {
        it('should set answers to empty array if null or undefined', () => {
          input.questionType = QuestionType.CHECKBOX;
          input.answers = null;
          input.options = [];
          let questionBlock = new QuestionBlock(input);
          expect(questionBlock.options.length).toBe(0);
          input.answers = undefined;
          questionBlock = new QuestionBlock(input);
          expect(questionBlock.options.length).toBe(0);
        });
        it('should set options to empty array if null or undefined', () => {
          input.questionType = QuestionType.CHECKBOX;
          input.answers = [];
          input.options = null;
          let questionBlock = new QuestionBlock(input);
          expect(questionBlock.options.length).toBe(0);
          input.options = undefined;
          questionBlock = new QuestionBlock(input);
          expect(questionBlock.options.length).toBe(0);
        });
        it('should change both options and answers to empty array', () => {
          input.questionType = QuestionType.CHECKBOX;
          input.answers = null;
          input.options = null;
          let questionBlock = new QuestionBlock(input);
          expect(questionBlock.options.length).toBe(0);
          expect(questionBlock.answers.length).toBe(0);
          input.answer = undefined;
          input.options = undefined;
          questionBlock = new QuestionBlock(input);
          expect(questionBlock.options.length).toBe(0);
          expect(questionBlock.answers.length).toBe(0);
        });
      });
    });

  });

  describe('Immutability Testing', () => {
    it('should not have mutable answers', () => {
      input.answers = ['answer1'];
      input.options = ['answer1', 'answer2'];
      const block = new QuestionBlock(input);
      block.answers.push('answer2');
      expect(block.answers.length).toEqual(1);
    });
    it('should not have mutable options', () => {
      input.answers = ['answer1'];
      input.options = ['answer1'];
      const block = new QuestionBlock(input);
      block.options.push('answer2');
      expect(block.options.length).toEqual(1);
    });
  });

});
