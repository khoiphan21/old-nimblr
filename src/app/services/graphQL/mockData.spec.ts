import { MockAPIDataFactory } from "./mockData";
import { isUuid } from '../../classes/helpers';
import { BlockType } from '../../../API';

const uuidv4 = require('uuid/v4');

fdescribe('MockAPIDataFactory', () => {
  const queryName = 'testQueryName';

  describe('createBlock()', () => {
    it('should return data with the right queryName', () => {
      const response = MockAPIDataFactory.createBlock({ queryName });
      expect(response.data[queryName]).toBeTruthy();
    });

    describe('when given no argument', () => {
      let block: any;
      beforeAll(() => {
        const response = MockAPIDataFactory.createBlock({ queryName });
        block = response.data[queryName];
      });

      // Check if the uuid params are correct uuids
      ['id', 'version', 'documentId', 'lastUpdatedBy'].forEach(uuidParam => {
        it(`should return a block with a valid ${uuidParam}`, () => {
          expect(isUuid(block[uuidParam])).toBe(true);
        });
      });

      it('should return a block with a valid type', () => {
        expect(block.type).toBe(BlockType.TEXT);
      });

      // Check if the date params are correct dates
      ['updatedAt', 'createdAt'].forEach(dateParam => {
        it(`should return a block with a valid ${dateParam}`, () => {
          expect(`${new Date(block[dateParam])}`.indexOf('Invalid'))
            .toBeLessThan(0);
        });
      });
    });

    describe('when given a specific argument', () => {
      let block: any;
      let input: any;
      beforeAll(() => {
        input = {
          queryName,
          id: uuidv4(),
          version: uuidv4(),
          type: BlockType.TEXT,
          documentId: uuidv4(),
          lastUpdatedBy: uuidv4(),
          updatedAt: new Date('01/01/2020').toISOString(),
          createdAt: new Date('01/01/2020').toISOString()
        };
        const response = MockAPIDataFactory.createBlock(input);
        block = response.data[queryName];
      });

      [
        'id', 'version', 'type', 'documentId', 'lastUpdatedBy',
        'updatedAt', 'createdAt'
      ].forEach(param => {
        it(`should return a block with the right ${param}`, () => {
          expect(block[param]).toEqual(input[param]);
        });
      });
    });
  });
});
