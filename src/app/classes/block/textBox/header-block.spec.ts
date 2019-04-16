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
  };

  beforeEach(() => {
    getMockInput();
  });

  describe('Parameters validation', () => {
    beforeEach(() => { });

    it('should instantiate when textBlockType is a valid type', done => {
      mockInput.textBlockType = TextBlockType.HEADER;

      try {
        new HeaderBlock(mockInput);
        done();
      } catch (err) {
        fail();
      }
    });

    it('should fail to instantiate when textBlockType is not a valid type', done => {
      mockInput.textBlockType = 400;

      try {
        new HeaderBlock(mockInput);
        fail();
      } catch (err) {
        done();
      }
    });

    it('should instantiate when textBlockType is null by replacing as TEXT', done => {
      mockInput.textBlockType = null;

      try {
        const response = new HeaderBlock(mockInput);
        expect(response.textBlockType).toEqual(TextBlockType.TEXT);
        done();

      } catch (err) {
        fail();
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
