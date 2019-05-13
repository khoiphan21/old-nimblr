import { TestBed } from '@angular/core/testing';

import { BlockCommandService } from './block-command.service';
import { BlockType, InputType, DeleteBlockInput, TextBlockType, UpdateTextBlockInput } from 'src/API';
import { createTextBlock, updateTextBlock, createInputBlock, updateInputBlock } from '../../../../graphql/mutations';
import { processTestError } from 'src/app/classes/test-helpers.spec';
import { isValidDateString } from 'src/app/classes/isValidDateString';
import { RouterTestingModule } from '@angular/router/testing';
import { BlockFactoryService } from '../factory/block-factory.service';
import { configureTestSuite } from 'ng-bullet';

const uuidv4 = require('uuid/v4');

describe('BlockCommandService', () => {
  let service: BlockCommandService;
  let textInput: any;
  let inputInput: any;
  let headerInput: any;

  // variables to use with the spy
  let graphQlSpy: jasmine.Spy;
  let textBlockBackendResponse: any;
  let inputBlockBackendResponse: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    });
  });

  beforeEach(() => {

    // Setup the input to be used in the tests
    textInput = {
      id: uuidv4(),
      version: uuidv4(),
      type: BlockType.TEXT,
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      value: 'from updateBlock test',
      textBlockType: TextBlockType.TEXT,
    };

    headerInput = {
      id: uuidv4(),
      version: uuidv4(),
      type: BlockType.TEXT,
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      value: 'header value test',
      textBlockType: TextBlockType.HEADER,
    };

    inputInput = {
      id: uuidv4(),
      version: uuidv4(),
      type: BlockType.INPUT,
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      answers: [],
      inputType: InputType.TEXT,
      options: null,
      isLocked: false
    };

    // Get the service
    service = TestBed.get(BlockCommandService);
    // spy on the graphql service
    /* tslint:disable:no-string-literal */
    graphQlSpy = spyOn(service['graphQLService'], 'query');
    textBlockBackendResponse = { value: 'test' };
    inputBlockBackendResponse = { answers: [], inputType: InputType.TEXT, options: null };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateBlock()', () => {

    it('should return an error if the type is not supported', done => {
      textInput.type = 'ABCD';
      service.updateBlockLegacy(textInput).then(() => {
        fail('error should be thrown'); done();
      }).catch(error => {
        expect(error).toEqual('BlockType not supported');
        done();
      });
    });

    it('should set a new version', async () => {
      // Updating text block
      await service.updateBlockLegacy(textInput);
      let version = graphQlSpy.calls.mostRecent().args[1].input.version;
      expect(version).not.toEqual(textInput.version);
      // Updating input block
      await service.updateBlockLegacy(inputInput);
      version = graphQlSpy.calls.mostRecent().args[1].input.version;
      expect(version).not.toEqual(inputInput.version);
    });

    it('should register the version to the VersionService', () => {
      service.updateBlockLegacy(textInput);
      const version = graphQlSpy.calls.mostRecent().args[1].input.version;
      expect(service['versionService'].isRegistered(version)).toBe(true);
    });

    describe('TextBlock -', () => {
      beforeEach(() => {
        graphQlSpy.and.returnValue(Promise.resolve(textBlockBackendResponse));
      });

      it('should resolve with the response from backend', done => {
        service.updateBlockLegacy(textInput).then(value => {
          // The value resolved must be the value returned by graphql
          expect(value).toEqual(textBlockBackendResponse);
          done();
        });
      });

      it('should call graphQlService with the right query', done => {
        service.updateBlockLegacy(textInput).then(() => {
          // graphQlService must be called with the right arguments
          const spyArgs = graphQlSpy.calls.mostRecent().args;
          expect(spyArgs[0]).toEqual(updateTextBlock);
          done();
        });
      });

      it('should call graphQlService with the right argument', done => {
        service.updateBlockLegacy(textInput).then(() => {
          // graphQlService must be called with the right arguments
          const queryArg = graphQlSpy.calls.mostRecent().args[1];
          // the queryArg should have a valid 'updatedAt' date string
          expect(queryArg.input.updatedAt).toBeTruthy();
          expect(isValidDateString(queryArg.input.updatedAt)).toBe(true);
          // delete 'type' from input as it should be ignored
          delete textInput.type;
          // delete 'updatedAt' from queryArg as it's auto-generated
          delete queryArg.input.updatedAt;
          // delete version as it is reset
          delete textInput.version;
          delete queryArg.input.version;
          // now check all other args
          expect(queryArg.input).toEqual(textInput);
          done();
        }).catch(error =>
          processTestError('unable to update block', error, done)
        );
      });

      it('should change the value to null if is an empty string', async () => {
        textInput.value = '';
        await service.updateBlockLegacy(textInput);
        // graphQlService must be called with the right arguments
        const queryArg = graphQlSpy.calls.mostRecent().args[1];
        // the queryArg should have a valid 'updatedAt' date string
        expect(queryArg.input.value).toBe(null);
      });

      describe('(error pathways)', () => {
        const requiredParams = [
          'id', 'documentId', 'lastUpdatedBy', 'value'
        ];
        runTestForTextMissingParams(
          requiredParams, 'updateBlock', 'UpdateTextBlockInput'
        );
      });
    });

    describe('InputBlock -', () => {
      beforeEach(() => {
        graphQlSpy.and.returnValue(Promise.resolve(inputBlockBackendResponse));
      });

      it('should resolve with the response from backend', done => {
        service.updateBlockLegacy(inputInput).then(value => {
          // The value resolved must be the value returned by graphql
          expect(value).toEqual(inputBlockBackendResponse);
          done();
        });
      });

      it('should call graphQlService with the right query', done => {
        service.updateBlockLegacy(inputInput).then(() => {
          // graphQlService must be called with the right arguments
          const spyArgs = graphQlSpy.calls.mostRecent().args;
          expect(spyArgs[0]).toEqual(updateInputBlock);
          done();
        });
      });

      it('should call graphQlService with the right argument', done => {
        service.updateBlockLegacy(inputInput).then(() => {
          // graphQlService must be called with the right arguments
          const queryArg = graphQlSpy.calls.mostRecent().args[1];
          // the queryArg should have a valid 'updatedAt' date string
          expect(queryArg.input.updatedAt).toBeTruthy();
          expect(isValidDateString(queryArg.input.updatedAt)).toBe(true);
          // delete 'type' from input as it should be ignored
          delete inputInput.type;
          // delete 'updatedAt' from queryArg as it's auto-generated
          delete queryArg.input.updatedAt;
          // delete version as it will be reset
          delete queryArg.input.version;
          delete inputInput.version;
          // now check all other args
          expect(queryArg.input).toEqual(inputInput);
          done();
        }).catch(error =>
          processTestError('unable to update block', error, done)
        );
      });

      it('should change the value to null if is undefined', async () => {
        inputInput.options = undefined;
        await service.updateBlockLegacy(inputInput);
        // graphQlService must be called with the right arguments
        const queryArg = graphQlSpy.calls.mostRecent().args[1];
        // the queryArg should have a valid 'updatedAt' date string
        expect(queryArg.input.options).toBe(null);
      });

      describe('(error pathways)', () => {
        const requiredParams = [
          'id', 'documentId', 'lastUpdatedBy', 'answers', 'inputType'
        ];
        runTestForInputMissingParams(
          requiredParams, 'updateBlock', 'UpdateInputBlockInput'
        );
      });
    });

    describe('HeaderBlock -', () => {
      beforeEach(() => {
        graphQlSpy.and.returnValue(Promise.resolve(textBlockBackendResponse));
      });

      it('should resolve with the response from backend', done => {
        service.updateBlockLegacy(headerInput).then(value => {
          // The value resolved must be the value returned by graphql
          expect(value).toEqual(textBlockBackendResponse);
          done();
        });
      });

      it('should call graphQlService with the right query', done => {
        service.updateBlockLegacy(headerInput).then(value => {
          // The value resolved must be the value returned by graphql
          expect(graphQlSpy.calls.mostRecent().args[0]).toEqual(updateTextBlock);
          done();
        });
      });

      it('should change the value to null if is an empty string', done => {
        headerInput.value = '';
        service.updateBlockLegacy(headerInput).then(value => {
          const actualInput = graphQlSpy.calls.mostRecent().args[1].input;
          expect(actualInput.value).toBe(null);
          done();
        });
      });
    });

  });

  describe('createBlock -', () => {

    it('should throw an error if the block type is not supported', done => {
      textInput.type = 'ABCD';
      service.createBlock(textInput).then(() => {
        fail('error should be thrown'); done();
      }).catch(error => {
        expect(error).toEqual('BlockType not supported');
        done();
      });
    });

    it('should set a new version', () => {
      const version = uuidv4();
      textInput.version = version;
      service.createBlock(textInput);
      expect(textInput.version).not.toEqual(version);
    });

    describe('TextBlock -', () => {
      beforeEach(() => {
        graphQlSpy.and.returnValue(Promise.resolve(textBlockBackendResponse));
      });

      it('should resolve with the response from backend', done => {
        service.createBlock(textInput).then(value => {
          // The value resolved must be the value returned by graphql
          expect(value).toEqual(textBlockBackendResponse);
          done();
        });
      });

      it('should call graphQlService with the right query', done => {
        service.createBlock(textInput).then(() => {
          // graphQlService must be called with the right arguments
          const spyArgs = graphQlSpy.calls.mostRecent().args;
          expect(spyArgs[0]).toEqual(createTextBlock);
          done();
        });
      });

      it('should call graphQlService with the right argument', done => {
        service.createBlock(textInput).then(() => {
          // graphQlService must be called with the right arguments
          const queryArg = graphQlSpy.calls.mostRecent().args[1];
          // the queryArg must have the same values
          expect(queryArg.input).toEqual(textInput);
          done();
        });
      });

      it('should change "value" to be null if given an empty string', done => {
        // set 'value' to be an empty string
        textInput.value = '';
        // Now call the service
        service.createBlock(textInput).then(() => {
          // graphQlService must be called with the right arguments
          const queryArg = graphQlSpy.calls.mostRecent().args[1];
          // the queryArg must have the same values
          expect(queryArg.input.value).toEqual(null);
          done();
        });
      });

      it('should return the error raised by GraphQl if unable to create', done => {
        // Setup the spy to return a certain error
        const mockError = { message: 'test' };
        graphQlSpy.and.returnValue(Promise.reject(mockError));
        // now call the service
        service.createBlock(textInput).then(() => {
          fail('error should be thrown'); done();
        }).catch(error => {
          expect(error).toEqual(mockError);
          done();
        });
      });

      describe('(error pathways)', () => {
        const requiredParams = ['id', 'documentId', 'lastUpdatedBy'];
        runTestForTextMissingParams(
          requiredParams, 'createBlock', 'CreateTextBlockInput'
        );
      });
    });

    describe('InputBlock -', () => {
      beforeEach(() => {
        graphQlSpy.and.returnValue(Promise.resolve(inputBlockBackendResponse));
      });

      it('should resolve with the response from backend', done => {
        service.createBlock(inputInput).then(value => {
          // The value resolved must be the value returned by graphql
          expect(value).toEqual(inputBlockBackendResponse);
          done();
        });
      });

      it('should call graphQlService with the right query', done => {
        service.createBlock(inputInput).then(() => {
          // graphQlService must be called with the right arguments
          const spyArgs = graphQlSpy.calls.mostRecent().args;
          expect(spyArgs[0]).toEqual(createInputBlock);
          done();
        });
      });

      it('should call graphQlService with the right argument', done => {
        service.createBlock(inputInput).then(() => {
          // graphQlService must be called with the right arguments
          const queryArg = graphQlSpy.calls.mostRecent().args[1];
          // the queryArg must have the same values
          expect(queryArg.input).toEqual(inputInput);
          done();
        });
      });

      describe('cleanInputOptions()', () => {

        it('should change "options" to be null if given undefined', done => {
          inputInput.options = undefined;
          // Now call the service
          service.createBlock(inputInput).then(() => {
            // graphQlService must be called with the right arguments
            const queryArg = graphQlSpy.calls.mostRecent().args[1];
            // the queryArg must have the same values
            expect(queryArg.input.options).toBe(null);
            done();
          });
        });

        it('should convert items that consists empty string to null', () => {
          const dirtyOptions = [''];
          const cleanedOptions = service['cleanInputOptions'](dirtyOptions);
          expect(cleanedOptions[0]).toBe(null);
        });
      });

      it('should return the error raised by GraphQl if unable to create', done => {
        // Setup the spy to return a certain error
        const mockError = 'test';
        // graphQlSpy.and.returnValue(Promise.reject(mockError));
        graphQlSpy.and.callFake(() => {
          throw new Error(mockError);
        });
        // now call the service
        service.createBlock(inputInput).then(() => {
          fail('error should be thrown'); done();
        }).catch(() => {
          expect(service.createBlock).toThrowError();
          done();
        });
      });

      describe('(error pathways)', () => {
        const requiredParams = ['id', 'documentId', 'lastUpdatedBy'];
        runTestForInputMissingParams(
          requiredParams, 'createBlock', 'createInputBlockInput'
        );
      });
    });

    describe('HeaderBlock', () => {
      beforeEach(() => {
        graphQlSpy.and.returnValue(Promise.resolve(inputBlockBackendResponse));
      });

      describe('execution in createTextBlock()', () => {
        it('should resolve response from backend', async () => {
          const data = await service.createBlock(headerInput);
          expect(data).toEqual(inputBlockBackendResponse);
        });

        it('should call query method', async () => {
          await service.createBlock(headerInput);
          expect(graphQlSpy.calls.count()).toBe(1);
        });

        it('should reject promise when query method failed', done => {
          const expectedError = 'test err';
          graphQlSpy.and.returnValue(Promise.reject(new Error(expectedError)));
          service.createBlock(headerInput).catch(err => {
            expect(err.message).toEqual(expectedError);
            done();
          });
        });
      });
    });
  });

  describe('deleteBlock', () => {
    let mockInput: DeleteBlockInput;

    beforeEach(() => {
      graphQlSpy.and.returnValue(Promise.resolve('ok'));
      mockInput = { id: 'test id' };
    });

    it('should return a promise', () => {
      const data = service.deleteBlock(mockInput);
      expect(data instanceof Promise).toBeTruthy();
    });

    it('should call graphQlservice query', async () => {
      await service.deleteBlock(mockInput);
      expect(graphQlSpy.calls.count()).toBe(1);
    });

    it('should call graphQlservice query with expected arguments', async () => {
      await service.deleteBlock(mockInput);
      const input = { id: 'test id' };
      expect(graphQlSpy.calls.mostRecent().args[1]).toEqual({ input });
    });

    it('should reject with appropriate error from API when failed', done => {
      const expectedError = 'test err';
      graphQlSpy.and.returnValue(Promise.reject(new Error(expectedError)));
      service.deleteBlock(mockInput).catch(err => {
        expect(err.message).toEqual(expectedError);
        done();
      });
    });
  });

  function runTestForTextMissingParams(
    params: Array<string>, functionName: string, context: string
  ) {
    params.forEach(param => {
      // run test for each type of error: 'undefined' and 'null' values
      ['undefined', 'null'].forEach(errorType => {
        it(`should throw an error if ${param} is ${errorType}`, done => {
          // edit the input based on what type of error is being checked
          if (errorType === 'undefined') {
            delete textInput[param];
          } else {
            textInput[param] = null;
          }
          // call the service
          service[functionName](textInput).then(() => {
            fail('error should occur'); done();
          }).catch(error => {
            expect(error.message).toEqual(
              `Missing argument "${param}" in ${context}`
            );
            done();
          });
        });
      });
    });
  }

  function runTestForInputMissingParams(
    params: Array<string>, functionName: string, context: string
  ) {
    params.forEach(param => {
      // run test for each type of error: 'undefined' and 'null' values
      ['undefined', 'null'].forEach(errorType => {
        it(`should throw an error if ${param} is ${errorType}`, done => {
          // edit the input based on what type of error is being checked
          if (errorType === 'undefined') {
            delete inputInput[param];
          } else {
            inputInput[param] = null;
          }
          // call the service
          service[functionName](inputInput).then(() => {
            fail('error should occur'); done();
          }).catch(error => {
            expect(error.message).toEqual(
              `Missing argument "${param}" in ${context}`
            );
            done();
          });
        });
      });
    });
  }

  describe('duplicateBlocks()', () => {

    it('when given an empty array should return the same', async () => {
      const blocks = await service.duplicateBlocks([]);
      expect(blocks).toEqual([]);
    });

    it('should call duplicateOneBlock() for each input', () => {
      const inputs = [
        { id: uuidv4() }, { id: uuidv4 }
      ];
      const duplicateSpy = spyOn<any>(service, 'duplicateOneBlock');
      service.duplicateBlocks(inputs);
      expect(duplicateSpy.calls.count()).toBe(2);
      duplicateSpy.calls.allArgs().forEach(arg => {
        expect(inputs.includes(arg[0])).toBe(true);
      });
    });

    it('should resolve with the results from duplicateOneBlock', async () => {
      const inputs = [
        { id: uuidv4() }, { id: uuidv4() }
      ];
      const duplicateSpy = spyOn<any>(service, 'duplicateOneBlock');
      const resolveValue = { id: uuidv4() };
      duplicateSpy.and.returnValue(Promise.resolve(resolveValue));
      const results = await service.duplicateBlocks(inputs);
      expect(results).toEqual([resolveValue, resolveValue]);
    });
  });

  describe('duplicateOneBlock', () => {
    let createSpy: jasmine.Spy;
    let blockFactory: BlockFactoryService;
    let block: any;

    const testValue = { id: uuidv4() };

    beforeEach(() => {
      createSpy = spyOn(service, 'createBlock');
      createSpy.and.returnValue(Promise.resolve({
        data: {
          createTextBlock: testValue,
          createInputBlock: testValue
        }
      }));
      blockFactory = TestBed.get(BlockFactoryService);
    });

    it('should call createBlock() with a new id', async () => {
      block = blockFactory.createNewTextBlock({
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });
      await service['duplicateOneBlock'](block);
      expect(createSpy.calls.mostRecent().args[0].id).not.toEqual(block.id);
    });

    it('should resolve with the return value for TEXT', async () => {
      block = blockFactory.createNewTextBlock({
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });
      const value = await service['duplicateOneBlock'](block);
      expect(value).toEqual(testValue);
    });

    it('should resolve with the return value for INPUT', async () => {
      block = blockFactory.createNewInputBlock({
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });
      const value = await service['duplicateOneBlock'](block);
      expect(value).toEqual(testValue);
    });

    it('should call createBlock() with the right args for TEXT', async () => {
      block = blockFactory.createNewTextBlock({
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });
      await service['duplicateOneBlock'](block);

      checkSpy();
    });

    it('should call createBlock() with the right args for INPUT', async () => {
      block = blockFactory.createNewInputBlock({
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });
      await service['duplicateOneBlock'](block);

      checkSpy();
    });

    function checkSpy() {
      const arg = {
        id: createSpy.calls.mostRecent().args[0].id,
        version: block.version,
        type: block.type,
        documentId: block.documentId,
        lastUpdatedBy: block.lastUpdatedBy,
        value: block.value,
        answers: block.answers,
        inputType: block.inputType,
        options: block.options,
        textBlockType: block.textBlockType
      };
      expect(createSpy).toHaveBeenCalledWith(arg);
    }
  });
});
