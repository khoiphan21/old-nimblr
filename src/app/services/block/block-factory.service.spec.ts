import { TestBed } from '@angular/core/testing';

import { BlockFactoryService } from './block-factory.service';
import { Block, TextBlock, BlockCreateError } from '../../classes/block';
import { isUuid } from '../../classes/helpers';
import { BlockType } from 'src/API';

const uuidv4 = require('uuid/v4');

describe('BlockFactoryService', () => {
  let factory: BlockFactoryService;
  let rawData;
  let block: Block;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    factory = TestBed.get(BlockFactoryService);
  });

  it('should be created', () => {
    expect(factory).toBeTruthy();
  });

  describe('Create app TextBlock with all parameters specified', () => {
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
          expect(error.blockType).toBe(null);
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
        it(`should throw BlockCreateError if ${parameter} is *missing*`, () => {
          delete rawData[parameter];
          try {
            block = factory.createAppBlock(rawData);
            fail(`Error must be thrown for missing ${parameter} `);
          } catch (error) {
            expect(error.blockType).toEqual(BlockType.TEXT);
            expect(error.message).toEqual(`BlockCreateError: ${parameter} is missing`);
          }
        });
      }

      function checkForNull(parameter: string) {
        it(`should throw BlockCreateError if ${parameter} is *null*`, () => {
          rawData[parameter] = null;
          try {
            block = factory.createAppBlock(rawData);
            fail(`Error must be thrown for ${parameter} being null`);
          } catch (error) {
            expect(error.blockType).toEqual(BlockType.TEXT);
            expect(error.message).toEqual(`BlockCreateError: ${parameter} cannot be null`);
          }
        });
      }

      function checkIfUuid(parameter: string) {
        it(`should throw BlockCreateError if ${parameter} is not a uuid`, () => {
          rawData[parameter] = `abcd`;
          try {
            block = factory.createAppBlock(rawData);
            fail(`Error must be thrown for ${parameter} not being uuid`);
          } catch (error) {
            expect(error.blockType).toEqual(BlockType.TEXT);
            expect(error.message).toEqual(`BlockCreateError: ${parameter} must be an uuid`);
          }
        });
      }

      function checkIfISOTimeString(parameter: string) {
        it(`should throw BlockCreateError if ${parameter} is not a valid time string`, () => {
          rawData[parameter] = `abcd`;
          try {
            block = factory.createAppBlock(rawData);
            fail(`Error must be thrown for ${parameter} not being a valid time string`);
          } catch (error) {
            expect(error.blockType).toEqual(BlockType.TEXT);
            expect(error.message).toEqual(`BlockCreateError: ${parameter} must be a valid time string`);
          }
        });

      }
    });
  });

  describe('Create app TextBlock with minimal parameters', () => {

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

  describe('(missing/error in parameters)', () => {
    it('should throw error if block type is not supported', () => {
      rawData.type = null;
      try {
        factory.createAppBlock(rawData);
      } catch (error) {
        expect(error.blockType).toBe(null);
        expect(error.message).toEqual('BlockType not supported')
      }
    });

    checkForError('id');
    checkForError('version');
    checkForError('documentId');
    checkForError('lastUpdatedBy');
    checkForError('value', false);

    function checkForError(parameter: string, shouldCheckUuid = true) {
      describe(`(${parameter} error)`, () => {
        checkForMissing(parameter);
        checkForNull(parameter);
        if (shouldCheckUuid) { checkIfUuid(parameter); }
      });
    }

    function checkForMissing(parameter: string) {
      it(`should throw BlockCreateError if ${parameter} is *missing*`, () => {
        delete rawData[parameter];
        try {
          block = factory.createAppBlock(rawData);
          fail(`Error must be thrown for missing ${parameter} `);
        } catch (error) {
          expect(error.blockType).toEqual(BlockType.TEXT);
          expect(error.message).toEqual(`BlockCreateError: ${parameter} is missing`);
        }
      });
    }

    function checkForNull(parameter: string) {
      it(`should throw BlockCreateError if ${parameter} is *null*`, () => {
        rawData[parameter] = null;
        try {
          block = factory.createAppBlock(rawData);
          fail(`Error must be thrown for ${parameter} being null`);
        } catch (error) {
          expect(error.blockType).toEqual(BlockType.TEXT);
          expect(error.message).toEqual(`BlockCreateError: ${parameter} cannot be null`);
        }
      });
    }

    function checkIfUuid(parameter: string) {
      it(`should throw BlockCreateError if ${parameter} is not a uuid`, () => {
        rawData[parameter] = `abcd`;
        try {
          block = factory.createAppBlock(rawData);
          fail(`Error must be thrown for ${parameter} not being uuid`);
        } catch (error) {
          expect(error.blockType).toEqual(BlockType.TEXT);
          expect(error.message).toEqual(`BlockCreateError: ${parameter} must be an uuid`);
        }
      });
    }
  });
});
