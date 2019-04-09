import { TestBed } from '@angular/core/testing';

import { BlockFactoryService, CreateNewBlockInput } from './block-factory.service';
import { Block } from '../../../classes/block/block';
import { TextBlock } from '../../../classes/block/textBlock';
import { isUuid } from '../../../classes/helpers';
import { BlockType, QuestionType } from 'src/API';
import { QuestionBlock } from 'src/app/classes/block/question-block';

const uuidv4 = require('uuid/v4');

describe('BlockFactoryService', () => {
  let factory: BlockFactoryService;
  let input: CreateNewBlockInput;


  beforeEach(() => {
    TestBed.configureTestingModule({});
    factory = TestBed.get(BlockFactoryService);
    input = {
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4()
    };
  });

  it('should be created', () => {
    expect(factory).toBeTruthy();
  });

  describe('createNewTextBlock()', () => {
    let block: TextBlock;

    beforeEach(() => {
      block = factory.createNewTextBlock(input);
    });

    it('should have the initial value of an empty string', () => {
      expect(block.value).toEqual('');
    });
    it('should create an object of type TextBlock', () => {
      expect(block instanceof TextBlock).toBe(true);
    });
    it('should store the document ID', () => {
      expect(block.documentId).toEqual(input.documentId);
    });

    it('should store the lastUpdatedBy', () => {
      expect(block.lastUpdatedBy).toEqual(input.lastUpdatedBy);
    });

    // no need to check for other properties as they are validated within the class
  });


  describe('createNewHeaderBlock()', () => {
    // TODO: @bruno Not implemented yet: header-block
    beforeEach(() => {

    });

    it('should have the initial value of an empty string', () => {

    });

    it('should create an object of type HeaderBlock', () => {

    });

    it('should register the textfield type', () => {

    });

  });

  describe('createNewQuestionBlock()', () => {
    let block: QuestionBlock;

    beforeEach(() => {
      block = factory.createNewQuestionBlock(input);
    });

    describe('initial values', () => {
      it('should have the initial question of empty string', () => {
        expect(block.question).toEqual('');
      });
      it('should have the initial questionType of SHORT_ANSWER', () => {
        expect(block.questionType).toEqual(QuestionType.SHORT_ANSWER);
      });
    });

    it('should create an object of type QuestionBlock', () => {
      expect(block instanceof QuestionBlock).toBe(true);
    });
    it('should have the right type', () => {
      expect(block.type).toBe(BlockType.QUESTION);
    });

    it('should store the document ID', () => {
      expect(block.documentId).toEqual(input.documentId);
    });

    it('should store the lastUpdatedBy', () => {
      expect(block.lastUpdatedBy).toEqual(input.lastUpdatedBy);
    });

    // no need to check for other properties as they are validated within the class
  });

  describe('Create app TextBlock with all parameters specified', () => {
    let rawData;
    let block: Block;
    beforeEach(() => {
      rawData = {
        id: uuidv4(),
        type: BlockType.TEXT,
        version: uuidv4(),
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4(),
        value: 'Test Value',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      block = factory.createAppBlock(rawData);
    });

    it('should create a text block', () => {
      expect(block instanceof TextBlock).toBe(true);
    });
    it('should have the right id if given one', () => {
      // set id
      rawData.id = uuidv4();
      block = factory.createAppBlock(rawData);
      expect(isUuid(block.id)).toBe(true);
      expect(block.id).toEqual(rawData.id);
    });
    it('should have the right type', () => {
      expect(block.type).toEqual(rawData.type);
    });
    it('should have the right version', () => {
      expect(block.version).toEqual(rawData.version);
    });
    it('should have the right documentId', () => {
      expect(block.documentId).toEqual(rawData.documentId);
    });
    it('should have the right lastUpdatedBy', () => {
      expect(block.lastUpdatedBy).toEqual(rawData.lastUpdatedBy);
    });
    it('should have the right value', () => {
      const textBlock: TextBlock = block as TextBlock;
      expect(textBlock.value).toEqual(rawData.value);
    });
    it('should have the right updatedAt if given one', () => {
      rawData.updatedAt = new Date('01/01/2100').toISOString();
      block = factory.createAppBlock(rawData);
      expect(block.updatedAt).toEqual(rawData.updatedAt);
    });
    it('should have the right createdAt if given one', () => {
      rawData.createdAt = new Date('01/01/2100').toISOString();
      block = factory.createAppBlock(rawData);
      expect(block.createdAt).toEqual(rawData.createdAt);
    });

    describe('(missing/error in parameters)', () => {
      it('should throw error if block type is not supported', () => {
        rawData.type = 'abcd';
        try {
          factory.createAppBlock(rawData);
        } catch (error) {
          expect(error.message).toEqual('BlockType not supported');
        }
      });

      ['id', 'type', 'version', 'documentId', 'lastUpdatedBy',
        'createdAt', 'updatedAt'
      ].forEach(paramName => {
        checkForNull(paramName);
      });

      ['type', 'documentId', 'lastUpdatedBy'].forEach(paramName => {
        checkForMissing(paramName);
      });

      ['id', 'version', 'documentId', 'lastUpdatedBy'].forEach(paramName => {
        checkIfUuid(paramName);
      });

      ['createdAt', 'updatedAt'].forEach(paramName => {
        checkIfISOTimeString(paramName);
      });


      function checkForMissing(parameter: string) {
        it(`should throw Error if ${parameter} is *missing*`, () => {
          delete rawData[parameter];
          try {
            block = factory.createAppBlock(rawData);
            fail(`Error must be thrown for missing ${parameter} `);
          } catch (error) {
            expect(error.message).toEqual(`${parameter} is missing`);
          }
        });
      }

      function checkForNull(parameter: string) {
        it(`should throw Error if ${parameter} is *null*`, () => {
          rawData[parameter] = null;
          try {
            block = factory.createAppBlock(rawData);
            fail(`Error must be thrown for ${parameter} being null`);
          } catch (error) {
            expect(error.message).toEqual(`${parameter} cannot be null`);
          }
        });
      }

      function checkIfUuid(parameter: string) {
        it(`should throw Error if ${parameter} is not a uuid`, () => {
          rawData[parameter] = `abcd`;
          try {
            block = factory.createAppBlock(rawData);
            fail(`Error must be thrown for ${parameter} not being uuid`);
          } catch (error) {
            expect(error.message).toEqual(`${parameter} must be an uuid`);
          }
        });
      }

      function checkIfISOTimeString(parameter: string) {
        it(`should throw Error if ${parameter} is not a valid time string`, () => {
          rawData[parameter] = `abcd`;
          try {
            block = factory.createAppBlock(rawData);
            fail(`Error must be thrown for ${parameter} not being a valid time string`);
          } catch (error) {
            expect(error.message).toEqual(`${parameter} must be a valid time string`);
          }
        });

      }
    });
  });

  describe('Create app QuestionBlock with all parameters specified', () => {
    let rawData;
    let block: Block;
    beforeEach(() => {
      rawData = {
        id: uuidv4(),
        type: BlockType.QUESTION,
        version: uuidv4(),
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        question: 'Is this a test value?',
        answers: [''],
        questionType: QuestionType.PARAGRAPH,
      };
      block = factory.createAppBlock(rawData);
    });

    it('should create a question block', () => {
      expect(block instanceof QuestionBlock).toBe(true);
    });

    it('should have the right type', () => {
      expect(block.type).toEqual(rawData.type);
    });

    it('should have the right value for question', () => {
      const questionBlock: QuestionBlock = block as QuestionBlock;
      expect(questionBlock.question).toEqual(rawData.question);
    });

    it('should have the right question type', () => {
      const questionBlock: QuestionBlock = block as QuestionBlock;
      expect(questionBlock.questionType).toEqual(rawData.questionType);
    });
  });

  describe('Create app TextBlock with minimal parameters', () => {
    let rawData;
    let block: Block;

    beforeEach(() => {
      rawData = {
        type: BlockType.TEXT,
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4(),
        value: 'Test Value'
      };
      block = factory.createAppBlock(rawData);
    });

    it('should create a text block', () => {
      expect(block instanceof TextBlock).toBe(true);
    });
    it('should generate a uuid for the id if not given', () => {
      expect(isUuid(block.id)).toBe(true);
    });
    it('should generate a uuid for the version if not given', () => {
      expect(isUuid(block.version)).toEqual(true);
    });
    it('should generate a createdAt if not given', () => {
      expect(typeof block.createdAt).toEqual('string');
      expect(new Date(block.createdAt) instanceof Date).toBe(true);
    });
    it('should generate a updatedAt if not given', () => {
      expect(typeof block.updatedAt).toEqual('string');
      expect(new Date(block.updatedAt) instanceof Date).toBe(true);
    });
  });

  describe('createAppBlock() - QuestionBlock with minimal parameters', () => {
    let rawData;
    let block: QuestionBlock;

    beforeEach(() => {
      rawData = {
        type: BlockType.QUESTION,
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      };
      block = factory.createAppBlock(rawData) as QuestionBlock;
    });

    it('should create a QuestionBlock', () => {
      expect(block instanceof QuestionBlock).toBe(true);
    });
    it('should set question to an empty string', () => {
      expect(block.question).toEqual('');
    });
    it('should set answers to an empty array', () => {
      expect(block.answers).toEqual([]);
    });
    it('should set questionType to SHORT_ANSWER', () => {
      expect(block.questionType).toEqual(QuestionType.SHORT_ANSWER);
    });
    it('should set the options to an empty array', () => {
      expect(block.options).toEqual([]);
    });
  });
});
