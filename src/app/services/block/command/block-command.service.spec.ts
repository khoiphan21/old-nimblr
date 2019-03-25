import { TestBed } from '@angular/core/testing';

import { BlockCommandService } from './block-command.service';
import { BlockType, QuestionType } from 'src/API';
import { createTextBlock, updateTextBlock, createQuestionBlock, updateQuestionBlock } from '../../../../graphql/mutations';
import { processTestError, isValidDateString } from 'src/app/classes/test-helpers.spec';

const uuidv4 = require('uuid/v4');


fdescribe('BlockCommandService', () => {
  let service: BlockCommandService;
  let textInput: any;
  let questionInput: any;
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

    describe('(error pathways)', () => {
      const requiredParams = [
        'id', 'version', 'documentId', 'lastUpdatedBy', 'value'
      ];
      runTestForMissingParams(
        requiredParams, 'updateBlock', 'UpdateTextBlockInput'
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

      // TODO: add updated at to the schema
      xit('should call graphQlService with the right argument', done => {
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

    describe('(error pathways)', () => {
      const requiredParams = ['id', 'version', 'documentId', 'lastUpdatedBy'];
      runTestForMissingParams(
        requiredParams, 'createBlock', 'CreateTextBlockInput'
      );
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
    });
  });

  function runTestForMissingParams(
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
});
