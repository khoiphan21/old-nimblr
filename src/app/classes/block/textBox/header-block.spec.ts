import { HeaderBlock } from './header-block';
import { TextBlockType } from 'src/API';


const uuid4 = require('uuid/v4');

describe('HeaderBlock', () => {
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
    let block: HeaderBlock;
    let keys: Array<string>;

    beforeEach(() => {
      block = new HeaderBlock(mockInput);
    });

    getMockInput();
    keys = Object.keys(mockInput);

    for (const property of keys) {
      it(`should store the right ${property}`, () => {
        expect(block[property]).toEqual(mockInput[property]);
      });
    }

    it('should always store textBlockType as HEADER', () => {
      // even when given a different type
      mockInput.textBlockType = TextBlockType.TEXT;
      block = new HeaderBlock(mockInput);
      expect(block.textBlockType).toEqual(TextBlockType.HEADER);
    });
  });
});
