import { BlockType, QuestionType } from 'src/API';
import { QuestionBlock } from './question-block';
const uuidv4 = require('uuid/v4');

describe('QuestionBlock -', () => {
  let input: any;

  // This is called first so that Object.keys(input) can be used later
  // for test automation
  resetInput();

  function resetInput() {
    input = {
      id: uuidv4(),
      type: BlockType.QUESTION, // only needed for test automation
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
  }

  beforeEach(() => {
    resetInput();
  });

  describe('Parameter Validation', () => {

    // test for properties that should be uuids
    ['id', 'version', 'documentId', 'lastUpdatedBy'].forEach(property => {
      it(`should throw an error if ${property} is not a valid uuid`, () => {
        const message = `${property} must be a valid uuid`;

        input[property] = 'abcd';
        runValidationTest(input, message);

        input[property] = null;
        runValidationTest(input, message);

        delete input[property];
        runValidationTest(input, message);
      });
    });

    function runValidationTest(newInput, message) {
      try {
        /* tslint:disable:no-unused-expression */
        new QuestionBlock(newInput);
        fail('error must be thrown');
      } catch (error) {
        const base = 'QuestionBlock failed to create: ';
        expect(error.message).toBe(base + message);
      }
    }

    // Tests for properties that should be time strings
    ['createdAt', 'updatedAt'].forEach(property => {
      it(`should throw an error if ${property} is not a valid time string`, () => {
        const message = `${property} must be a valid time string`;

        input[property] = 'abcd';
        runValidationTest(input, message);

        input[property] = null;
        runValidationTest(input, message);

        input[property] = undefined;
        runValidationTest(input, message);
      });
    });

    it('should throw error if question type is not supported', () => {
      const input2 = input as any;
      input2.questionType = 'abcd';
      runValidationTest(input, 'QuestionType not supported');
    });

    describe(' - Validating options and answers', () => {
      it('should throw error if answers is not an array', () => {
        input.answers = '';
        runValidationTest(input, '"answers" must be an array');
      });
      it('should throw error if options is not an array', () => {
        input.options = '';
        runValidationTest(input, '"options" must be an array');
      });
      it('should throw error if a value in answers is not a string', () => {
        input.answers = [1];
        runValidationTest(input, '"answers" must contain only strings');
      });
      it('should throw error if a value in options is not a string', () => {
        input.options = [1];
        runValidationTest(input, '"options" must contain only strings');
      });
    });
  });

  describe('Storing Values', () => {
    let block: QuestionBlock;

    beforeEach(() => {
      block = new QuestionBlock(input);
    });

    Object.keys(input).forEach(property => {
      it(`should store the right ${property}`, () => {
        expect(block[property]).toEqual(input[property]);
      });
    });

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
