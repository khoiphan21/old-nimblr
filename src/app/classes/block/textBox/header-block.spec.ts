import { HeaderBlock, HeaderBlockInput } from './header-block';
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
      textblocktype: TextBlockType.HEADER
    };
  };

  beforeEach(() => {
    getMockInput();
  });

  describe('Parameters validation', () => {
    beforeEach(() => { });

    it('should instantiate when textblocktype is a valid type', done => {
      mockInput.textblocktype = TextBlockType.HEADER;

      try {
        const block = new HeaderBlock(mockInput);
        done();
      } catch (err) {
        fail();
      }
    });

    it('should fail to instantiate when textblocktype is not a valid type', done => {
      mockInput.textblocktype = 400;

      try {
        const block = new HeaderBlock(mockInput);
        fail();
      } catch (err) {
        done();
      }
    });

    it('should fail to instantiate when textblocktype is null', done => {
      mockInput.textblocktype = null;

      try {
        const block = new HeaderBlock(mockInput);
        fail();
      } catch (err) {
        done();
      }
    });

  });

  describe('Storing values', () => {
    let block: HeaderBlock;
    let keys: Array<string>;

    beforeEach(() => {
      block = new HeaderBlock(mockInput);
    });

    getMockInput();
    keys = Object.keys(mockInput);

    for (let property of keys) {
      it(`should store the right ${property}`, () => {
        expect(block[property]).toEqual(mockInput[property]);
      });
    };
  });
});
