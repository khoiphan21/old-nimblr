import { BlockType } from 'src/API';
import { TextBlock } from './textBlock';

const uuidv4 = require('uuid/v4');

describe('TextBlock', () => {
  let input: any;

  // This is called first so that Object.keys(input) can be used later
  // for test automation
  resetInput();

  function resetInput() {
    input = {
      id: uuidv4(),
      type: BlockType.TEXT, // only needed for test automation
      version: uuidv4(),
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      value: 'abcd'
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
        new TextBlock(newInput);
        fail('error must be thrown');
      } catch (error) {
        const base = 'TextBlock failed to create: ';
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

  });

  describe('Storing Values', () => {
    let block: TextBlock;

    beforeEach(() => {
      block = new TextBlock(input);
    });

    Object.keys(input).forEach(property => {
      it(`should store the right ${property}`, () => {
        expect(block[property]).toEqual(input[property]);
      });
    });

    describe('storing property "value"', () => {
      it('should store value as empty string if null', () => {
        input.value = null;
        block = new TextBlock(input);
        expect(block.value).toEqual('');
      });
      it('should store value as empty string if undefined', () => {
        input.value = undefined;
        block = new TextBlock(input);
        expect(block.value).toEqual('');
      });
    });

  });
});