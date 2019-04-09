import { HeaderBlock, HeaderBlockInput } from './header-block';
import { TextBlockType } from 'src/API';


const uuid4 = require('uuid/v4');

describe('HeaderBlock', () => {
  let mockInput: any;

  function resetInput() {
    mockInput = {
      id: uuid4(),
      version: uuid4(),
      documentId: uuid4(),
      lastUpdatedBy: uuid4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      value: 'abcd',
      textblocktype: 'not implemented yet'
    };
  }

  beforeEach(() => {
    resetInput();
  });

  describe('Parameters validation', () => {
    // TODO: @bruno to be tested

    it('should instantiate when textblocktype is a valid type', done => {
      mockInput.textblocktype = TextBlockType.HEADER;
      mockInput.id = 12;

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

  });

  fdescribe('Storing values', () => {
    // TODO: @bruno Not implemented yet: header-block

    let block: HeaderBlock;

    beforeEach(() => {
      resetInput();
      block = new HeaderBlock(mockInput);
    });

    console.log("TCL: mockInput", mockInput);

    for (let property of mockInput) {
      it(`should store the right ${property}`, () => {
        expect(block[property]).toEqual(mockInput[property]);
      });
    }
    
    describe('storing property "textblocktype"', () => {

      // it('should store value as empty string if undefined', () => {
      //   mockInput.value = undefined;
      //   block = new HeaderBlock(mockInput);
      //   expect(block.value).toEqual('');
      // });
    });

  });
});
