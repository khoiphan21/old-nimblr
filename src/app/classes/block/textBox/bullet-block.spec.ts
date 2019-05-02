import { BulletBlock } from './bullet-block';
import { TextBlockType } from 'src/API';

const uuid4 = require('uuid/v4');

fdescribe('BulletBlock', () => {
  // TODO: @bruno to be tested
  let mockInput: any;

  function getMockInput() {
    mockInput = {
      id: uuid4(),
      version: uuid4(),
      documentId: uuid4(),
      lastUpdatedBy: uuid4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      value: 'abcd',
    };
  }

  beforeEach(() => {
    getMockInput();
  });

  describe('Storing values', () => {
    let block: BulletBlock;
    let keys: Array<string>;

    beforeEach(() => {
      block = new BulletBlock(mockInput);
    });

    getMockInput();
    keys = Object.keys(mockInput);

    for (const property of keys) {
      it(`should store the right ${property}`, () => {
        expect(block[property]).toEqual(mockInput[property]);
      });
    }

    it('should always store textBlockType as BULLET', () => {
      // even when given a different type
      mockInput.textBlockType = TextBlockType.TEXT;
      block = new BulletBlock(mockInput);
      expect(block.textBlockType).toEqual(TextBlockType.BULLET);
    });
  });
});
