import { UpdateBlockCommand } from './updateBlockCommand';
import { isUuid } from '../../helpers';
import { uuidv4 } from '../../uuidv4';
import { isValidDateString } from '../../isValidDateString';
import { BlockType, UpdateBlockInput, TextBlockType, InputType } from '../../../../API';

// tslint:disable:no-string-literal
describe('UpdateBlockCommand', () => {
  let command: UpdateBlockCommand;
  let input: any;

  let updateBlockSpy: jasmine.Spy;
  let versionSpy: jasmine.Spy;

  const mockUser = {
    id: uuidv4()
  };

  beforeEach(() => {
    input = {
      blockCommandService: { updateBlock: () => Promise.resolve() },
      accountService: { isUserReady: () => Promise.resolve(mockUser) },
      versionService: { registerVersion: () => { } }
    };

    command = new UpdateBlockCommand(input);

    // setup spies
    updateBlockSpy = spyOn(command['blockCommandService'], 'updateBlock');
    updateBlockSpy.and.callThrough();

    versionSpy = spyOn(command['versionService'], 'registerVersion');
    versionSpy.and.callThrough();
  });

  describe('with missing key values', () => {
    const updateInput = {
      id: '1234',
      type: BlockType.TEXT,
      value: 'hello'
    };
    let spyArg: any;

    beforeEach(async () => {
      await command.update(updateInput);

      spyArg = updateBlockSpy.calls.mostRecent().args[0];
    });

    it('should automatically generate a version', () => {
      expect(isUuid(spyArg.version)).toBeTruthy();
    });

    it('should retrieve and use the current user for lastUpdatedBy', () => {
      expect(spyArg.lastUpdatedBy).toEqual(mockUser.id);
    });

    it('should generate "updatedAt" to be a valid date string', () => {
      expect(isValidDateString(spyArg.updatedAt)).toBeTruthy();
    });

    describe('interaction with services', () => {
      it('should call to update block with the given property', async () => {
        expect(spyArg.value).toEqual(updateInput.value);
        expect(spyArg.id).toEqual(updateInput.id);
      });

      it('should call to register the version', () => {
        expect(versionSpy).toHaveBeenCalledWith(spyArg.version);
      });
    });

  });

  describe('with all values given', () => {
    const updateInput: UpdateBlockInput = {
      id: '1234',
      version: uuidv4(),
      type: undefined,
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      updatedAt: new Date().toISOString(),
      value: 'hello',
      textBlockType: TextBlockType.TEXT,
      answers: [],
      inputType: InputType.TEXT,
      options: [],
      isLocked: false
    };
    let spyArg: any;

    it('(BlockType.TEXT) should call to update with the right properties', async () => {
      updateInput.type = BlockType.TEXT;
      await command.update(updateInput);

      spyArg = updateBlockSpy.calls.mostRecent().args[0];

      [
        'id', 'version', 'type', 'documentId', 'lastUpdatedBy', 'updatedAt',
        'value', 'textBlockType'
      ].forEach(property => {
        const expected = `${property}: ${updateInput[property]}`;
        const result = `${property}: ${spyArg[property]}`;
        expect(expected).toEqual(result);
      });
    });

    it('(BlockType.INPUT) should call to update with the right properties', async () => {
      updateInput.type = BlockType.INPUT;
      await command.update(updateInput);

      spyArg = updateBlockSpy.calls.mostRecent().args[0];

      [
        'id', 'version', 'type', 'documentId', 'lastUpdatedBy', 'updatedAt',
        'answers', 'inputType', 'options', 'isLocked'
      ].forEach(property => {
        const expected = `${property}: ${updateInput[property]}`;
        const result = `${property}: ${spyArg[property]}`;
        expect(expected).toEqual(result);
      });
    });

  });

  describe('error pathways', () => {
    it('should complain if the type is invalid', async () => {
      try {
        const updateInput: any = { type: 'test' };
        await command.update(updateInput);
        fail('error must occur');
      } catch (error) {
        expect().nothing();
      }
    });
  });
});
