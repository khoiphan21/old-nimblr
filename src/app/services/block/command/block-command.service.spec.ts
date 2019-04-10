import { TestBed } from '@angular/core/testing';

import { BlockCommandService } from './block-command.service';
import { BlockType, QuestionType, DeleteBlockInput, TextBlockType } from 'src/API';
import { createTextBlock, updateTextBlock, createQuestionBlock, updateQuestionBlock } from '../../../../graphql/mutations';
import { processTestError } from 'src/app/classes/test-helpers.spec';
import { isValidDateString } from 'src/app/classes/isValidDateString';

const uuidv4 = require('uuid/v4');


describe('BlockCommandService', () => {
  let service: BlockCommandService;
  let textInput: any;
  let questionInput: any;
  let headerInput: any;

  // variables to use with the spy
  let graphQlSpy: jasmine.Spy;
  let textBlockBackendResponse: any;
  let questionBlockBackendResponse: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    // Setup the input to be used in the tests
    textInput = {
      id: uuidv4(),
      version: uuidv4(),
      type: BlockType.TEXT,
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      value: 'from updateBlock test'
    };

    headerInput = {
      id: uuidv4(),
      version: uuidv4(),
      type: BlockType.TEXT,
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      value: 'from updateBlock test',
      textblocktype: TextBlockType.HEADER,
    };

    questionInput = {
      id: uuidv4(),
      version: uuidv4(),
      type: BlockType.QUESTION,
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      question: 'QuestionBlock test',
      answers: [],
      questionType: QuestionType.PARAGRAPH,
      options: null
    };

    // Get the service
    service = TestBed.get(BlockCommandService);
    // spy on the graphql service
    /* tslint:disable:no-string-literal */
    graphQlSpy = spyOn(service['graphQLService'], 'query');
    textBlockBackendResponse = { value: 'test' };
    questionBlockBackendResponse = { question: 'test question', answers: [], questionType: QuestionType.PARAGRAPH, options: null };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateBlock', () => {

    it('should return an error if the type is not supported', done => {
      textInput.type = 'ABCD';
      service.updateBlock(textInput).then(() => {
        fail('error should be thrown'); done();
      }).catch(error => {
        expect(error).toEqual('BlockType not supported');
        done();
      });
    });

    /* tslint:disable:no-string-literal */
    it(`should store the updated block's version in the query service`, done => {
      service.updateBlock(textInput).then(() => {
        // The version must be stored
        expect(service['blockQueryService']['myVersions']
          .has(textInput.version)).toBe(true);
        done();
      }).catch(error =>
        processTestError('unable to update block', error, done)
      );
    });

    describe('TextBlock -', () => {
      beforeEach(() => {
        graphQlSpy.and.returnValue(Promise.resolve(textBlockBackendResponse));
      });

      it('should resolve with the response from backend', done => {
        service.updateBlock(textInput).then(value => {
          // The value resolved must be the value returned by graphql
          expect(value).toEqual(textBlockBackendResponse);
          done();
        });
      });

      it('should call graphQlService with the right query', done => {
        service.updateBlock(textInput).then(() => {
          // graphQlService must be called with the right arguments
          const spyArgs = graphQlSpy.calls.mostRecent().args;
          expect(spyArgs[0]).toEqual(updateTextBlock);
          done();
        });
      });

      it('should call graphQlService with the right argument', done => {
        service.updateBlock(textInput).then(() => {
          // graphQlService must be called with the right arguments
          const queryArg = graphQlSpy.calls.mostRecent().args[1];
          // the queryArg should have a valid 'updatedAt' date string
          expect(queryArg.input.updatedAt).toBeTruthy();
          expect(isValidDateString(queryArg.input.updatedAt)).toBe(true);
          // delete 'type' from input as it should be ignored
          delete textInput.type;
          // delete 'updatedAt' from queryArg as it's auto-generated
          delete queryArg.input.updatedAt;
          // now check all other args
          expect(queryArg.input).toEqual(textInput);
          done();
        }).catch(error =>
          processTestError('unable to update block', error, done)
        );
      });

      it('should change the value to null if is an empty string', async () => {
        textInput.value = '';
        await service.updateBlock(textInput);
        // graphQlService must be called with the right arguments
        const queryArg = graphQlSpy.calls.mostRecent().args[1];
        // the queryArg should have a valid 'updatedAt' date string
        expect(queryArg.input.value).toBe(null);
      });

      describe('(error pathways)', () => {
        const requiredParams = [
          'id', 'version', 'documentId', 'lastUpdatedBy', 'value'
        ];
        runTestForTextMissingParams(
          requiredParams, 'updateBlock', 'UpdateTextBlockInput'
        );
      });
    });

    describe('QuestionBlock -', () => {
      beforeEach(() => {
        graphQlSpy.and.returnValue(Promise.resolve(questionBlockBackendResponse));
      });

      it('should resolve with the response from backend', done => {
        service.updateBlock(questionInput).then(value => {
          // The value resolved must be the value returned by graphql
          expect(value).toEqual(questionBlockBackendResponse);
          done();
        });
      });

      it('should call graphQlService with the right query', done => {
        service.updateBlock(questionInput).then(() => {
          // graphQlService must be called with the right arguments
          const spyArgs = graphQlSpy.calls.mostRecent().args;
          expect(spyArgs[0]).toEqual(updateQuestionBlock);
          done();
        });
      });

      it('should call graphQlService with the right argument', done => {
        service.updateBlock(questionInput).then(() => {
          // graphQlService must be called with the right arguments
          const queryArg = graphQlSpy.calls.mostRecent().args[1];
          // the queryArg should have a valid 'updatedAt' date string
          expect(queryArg.input.updatedAt).toBeTruthy();
          expect(isValidDateString(queryArg.input.updatedAt)).toBe(true);
          // delete 'type' from input as it should be ignored
          delete questionInput.type;
          // delete 'updatedAt' from queryArg as it's auto-generated
          delete queryArg.input.updatedAt;
          // now check all other args
          expect(queryArg.input).toEqual(questionInput);
          done();
        }).catch(error =>
          processTestError('unable to update block', error, done)
        );
      });

      it('should change the value to null if is an empty string', async () => {
        questionInput.question = '';
        await service.updateBlock(questionInput);
        // graphQlService must be called with the right arguments
        const queryArg = graphQlSpy.calls.mostRecent().args[1];
        // the queryArg should have a valid 'updatedAt' date string
        expect(queryArg.input.question).toBe(null);
      });

      it('should change the value to null if is undefined', async () => {
        questionInput.options = undefined;
        await service.updateBlock(questionInput);
        // graphQlService must be called with the right arguments
        const queryArg = graphQlSpy.calls.mostRecent().args[1];
        // the queryArg should have a valid 'updatedAt' date string
        expect(queryArg.input.options).toBe(null);
      });

      describe('(error pathways)', () => {
        const requiredParams = [
          'id', 'version', 'documentId', 'lastUpdatedBy', 'answers', 'questionType'
        ];
        runTestForQuestionMissingParams(
          requiredParams, 'updateBlock', 'UpdateQuestionBlockInput'
        );
      });
    });

    describe('HeaderBlock -', () => {
      // TODO: @bruno Not implemented yet: header-block

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

    /* tslint:disable:no-string-literal */
    it(`should store the created block's version in the query service`, done => {
      service.createBlock(textInput).then(() => {
        // The version must be stored
        expect(service['blockQueryService']['myVersions']
          .has(textInput.version)).toBe(true);
        done();
      });
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
          expect(queryArg.input.value).toBe(null);
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
        const requiredParams = ['id', 'version', 'documentId', 'lastUpdatedBy'];
        runTestForTextMissingParams(
          requiredParams, 'createBlock', 'CreateTextBlockInput'
        );
      });
    });

    describe('QuestionBlock -', () => {
      beforeEach(() => {
        graphQlSpy.and.returnValue(Promise.resolve(questionBlockBackendResponse));
      });

      it('should resolve with the response from backend', done => {
        service.createBlock(questionInput).then(value => {
          // The value resolved must be the value returned by graphql
          expect(value).toEqual(questionBlockBackendResponse);
          done();
        });
      });

      it('should call graphQlService with the right query', done => {
        service.createBlock(questionInput).then(() => {
          // graphQlService must be called with the right arguments
          const spyArgs = graphQlSpy.calls.mostRecent().args;
          expect(spyArgs[0]).toEqual(createQuestionBlock);
          done();
        });
      });

      it('should call graphQlService with the right argument', done => {
        service.createBlock(questionInput).then(() => {
          // graphQlService must be called with the right arguments
          const queryArg = graphQlSpy.calls.mostRecent().args[1];
          // the queryArg must have the same values
          expect(queryArg.input).toEqual(questionInput);
          done();
        });
      });

      it('should change "value" to be null if given an empty string', done => {
        // set 'value' to be an empty string
        questionInput.question = '';
        // Now call the service
        service.createBlock(questionInput).then(() => {
          // graphQlService must be called with the right arguments
          const queryArg = graphQlSpy.calls.mostRecent().args[1];
          // the queryArg must have the same values
          expect(queryArg.input.question).toBe(null);
          done();
        });
      });

      describe('cleanQuestionOptions()', () => {

        it('should change "options" to be null if given undefined', done => {
          questionInput.options = undefined;
          // Now call the service
          service.createBlock(questionInput).then(() => {
            // graphQlService must be called with the right arguments
            const queryArg = graphQlSpy.calls.mostRecent().args[1];
            // the queryArg must have the same values
            expect(queryArg.input.options).toBe(null);
            done();
          });
        });

        it('should convert items that consists empty string to null', () => {
          const dirtyOptions = [''];
          const cleanedOptions = service['cleanQuestionOptions'](dirtyOptions);
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
        service.createBlock(questionInput).then(() => {
          fail('error should be thrown'); done();
        }).catch(() => {
          expect(service.createBlock).toThrowError();
          done();
        });
      });

      describe('(error pathways)', () => {
        const requiredParams = ['id', 'version', 'documentId', 'lastUpdatedBy'];
        runTestForQuestionMissingParams(
          requiredParams, 'createBlock', 'CreateQuestionBlockInput'
        );
      });
    });

    fdescribe('HeaderBlock', () => {
      // TODO: @bruno Not implemented yet: header-block
      beforeEach(() => {
        graphQlSpy.and.returnValue(Promise.resolve(questionBlockBackendResponse));
      });

      describe('execution in createTextBlock()', () => {
        it('should resolve response from backend', () => {
          service.createBlock(headerInput).then(data => {
            expect(data).toEqual(questionBlockBackendResponse);
          });
        });
  
        it('should call query method', () => {
          service.createBlock(headerInput).then(() => {
            expect(graphQlSpy.calls.count()).toBe(1);
          });
        });
  
        it('should reject promise when query method failed', () => {
          const expectedError = 'test err';
          graphQlSpy.and.returnValue(Promise.reject(new Error(expectedError)));
          service.createBlock(headerInput).catch(err => {
            expect(err.message).toEqual(expectedError);
          });
        });
      });

      describe('correctness of mapTextBoxType() mapping', () => {

        let createTextBlockSpy: jasmine.Spy;
        let createHeaderBlockSpy: jasmine.Spy;

        beforeEach(()=> {
          createTextBlockSpy = spyOn<any>(service, 'createTextBlock').and.callThrough();
          createHeaderBlockSpy = spyOn<any>(service, 'createHeaderBlock').and.callThrough();
        });

        it('should call createTextBlock', done => {
          service['mapTextBoxType'](textInput).then(data => {
            expect(createTextBlockSpy.calls.count()).toBe(1);
            expect(createHeaderBlockSpy.calls.count()).toBe(0);
            done();
          });
        });

        it('should call createHeaderBlockSpy', done => {
          service['mapTextBoxType'](headerInput).then(data => {
            expect(createTextBlockSpy.calls.count()).toBe(0);
            expect(createHeaderBlockSpy.calls.count()).toBe(1);
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

  function runTestForQuestionMissingParams(
    params: Array<string>, functionName: string, context: string
  ) {
    params.forEach(param => {
      // run test for each type of error: 'undefined' and 'null' values
      ['undefined', 'null'].forEach(errorType => {
        it(`should throw an error if ${param} is ${errorType}`, done => {
          // edit the input based on what type of error is being checked
          if (errorType === 'undefined') {
            delete questionInput[param];
          } else {
            questionInput[param] = null;
          }
          // call the service
          service[functionName](questionInput).then(() => {
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
});
