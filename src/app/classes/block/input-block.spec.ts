import { BlockType, InputType } from 'src/API';
import { InputBlock } from './input-block';
const uuidv4 = require('uuid/v4');

describe('InputBlock -', () => {
  let input: any;

  // This is called first so that Object.keys(input) can be used later
  // for test automation
  resetInput();

  function resetInput() {
    input = {
      id: uuidv4(),
      type: BlockType.INPUT, // only needed for test automation
      version: uuidv4(),
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      answers: [],
      inputType: InputType.TEXT,
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
        new InputBlock(newInput);
        fail('error must be thrown');
      } catch (error) {
        const base = 'InputBlock failed to create: ';
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

    it('should throw error if input type is not supported', () => {
      const input2 = input as any;
      input2.inputType = 'abcd';
      runValidationTest(input, 'InputType not supported');
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
    let block: InputBlock;

    beforeEach(() => {
      block = new InputBlock(input);
    });

    Object.keys(input).forEach(property => {
      it(`should store the right ${property}`, () => {
        expect(block[property]).toEqual(input[property]);
      });
    });

    it('should set the right value for `inputType`', () => {
      input.inputType = InputType.TEXT;
      const inputBlock = new InputBlock(input);
      expect(inputBlock.inputType).toEqual(InputType.TEXT);
    });

    it('should set the right value for `options`', () => {
      input.inputType = InputType.CHECKBOX;
      input.answers = ['this is the answer 1'];
      input.options = ['this is the answer 1', 'this is the answer 2'];
      const inputBlock = new InputBlock(input);
      expect(inputBlock.options[0]).toEqual('this is the answer 1');
      expect(inputBlock.options[1]).toEqual('this is the answer 2');
    });

    it('should set the right value for `answers` ', () => {
      input.inputType = InputType.CHECKBOX;
      input.answers = ['this is the answer 2'];
      input.options = ['this is the answer 2'];
      const block = new InputBlock(input);
      expect(block.answers[0]).toEqual('this is the answer 2');
    });

    describe('handling "answers" and "options" arrays', () => {
      it('should remove any answers that are not in options', () => {
        input.inputType = InputType.CHECKBOX;
        input.answers = ['this is the answer 2', 'EXTRA'];
        input.options = ['this is the answer 2'];
        const inputBlock = new InputBlock(input);
        expect(inputBlock.answers.length).toBe(1);
        expect(inputBlock.answers[0]).toEqual('this is the answer 2');
      });

      describe('(null or empty)', () => {
        it('should set answers to empty array if null or undefined', () => {
          input.inputType = InputType.CHECKBOX;
          input.answers = null;
          input.options = [];
          let inputBlock = new InputBlock(input);
          expect(inputBlock.options.length).toBe(0);
          input.answers = undefined;
          inputBlock = new InputBlock(input);
          expect(inputBlock.options.length).toBe(0);
        });
        it('should set options to empty array if null or undefined', () => {
          input.inputType = InputType.CHECKBOX;
          input.answers = [];
          input.options = null;
          let inputBlock = new InputBlock(input);
          expect(inputBlock.options.length).toBe(0);
          input.options = undefined;
          inputBlock = new InputBlock(input);
          expect(inputBlock.options.length).toBe(0);
        });
        it('should change both options and answers to empty array', () => {
          input.inputType = InputType.CHECKBOX;
          input.answers = null;
          input.options = null;
          let inputBlock = new InputBlock(input);
          expect(inputBlock.options.length).toBe(0);
          expect(inputBlock.answers.length).toBe(0);
          input.answer = undefined;
          input.options = undefined;
          inputBlock = new InputBlock(input);
          expect(inputBlock.options.length).toBe(0);
          expect(inputBlock.answers.length).toBe(0);
        });
      });
    });

  });

  describe('Immutability Testing', () => {
    it('should not have mutable answers', () => {
      input.answers = ['answer1'];
      input.options = ['answer1', 'answer2'];
      const block = new InputBlock(input);
      block.answers.push('answer2');
      expect(block.answers.length).toEqual(1);
    });
    it('should not have mutable options', () => {
      input.answers = ['answer1'];
      input.options = ['answer1'];
      const block = new InputBlock(input);
      block.options.push('answer2');
      expect(block.options.length).toEqual(1);
    });
  });

});
