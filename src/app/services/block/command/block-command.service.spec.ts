import { TestBed } from '@angular/core/testing';

import { BlockCommandService } from './block-command.service';
import { BlockType } from 'src/API';
import { createTextBlock, updateTextBlock } from '../../../../graphql/mutations';
import { processTestError, isValidDateString } from 'src/app/classes/test-helpers.spec';

const uuidv4 = require('uuid/v4');


describe('BlockCommandService', () => {
  let service: BlockCommandService;
  let input: any;
  // variables to use with the spy
  let graphQlSpy: jasmine.Spy;
  let backendResponse: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    // Setup the input to be used in the tests
    input = {
      id: uuidv4(),
      version: uuidv4(),
      type: BlockType.TEXT,
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      value: 'from updateBlock test'
    };

    // Get the service
    service = TestBed.get(BlockCommandService);
    // spy on the graphql service
    /* tslint:disable:no-string-literal */
    graphQlSpy = spyOn(service['graphQLService'], 'query');
    backendResponse = { value: 'test' };
    graphQlSpy.and.returnValue(Promise.resolve(backendResponse));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateBlock', () => {

    it('should return an error if the type is not supported', done => {
      input.type = 'ABCD';
      service.updateBlock(input).then(() => {
        fail('error should be thrown'); done();
      }).catch(error => {
        expect(error).toEqual('BlockType not supported');
        done();
      });
    });

    it('should resolve with the response from backend', done => {
      service.updateBlock(input).then(value => {
        // The value resolved must be the value returned by graphql
        expect(value).toEqual(backendResponse);
        done();
      });
    });

    it('should call graphQlService with the right query', done => {
      service.updateBlock(input).then(() => {
        // graphQlService must be called with the right arguments
        const spyArgs = graphQlSpy.calls.mostRecent().args;
        expect(spyArgs[0]).toEqual(updateTextBlock);
        done();
      });
    });

    it('should call graphQlService with the right argument', done => {
      service.updateBlock(input).then(() => {
        // graphQlService must be called with the right arguments
        const queryArg = graphQlSpy.calls.mostRecent().args[1];
        // the queryArg should have a valid 'updatedAt' date string
        expect(queryArg.input.updatedAt).toBeTruthy();
        expect(isValidDateString(queryArg.input.updatedAt)).toBe(true);
        // delete 'type' from input as it should be ignored
        delete input.type;
        // delete 'updatedAt' from queryArg as it's auto-generated
        delete queryArg.input.updatedAt;
        // now check all other args
        expect(queryArg.input).toEqual(input);
        done();
      }).catch(error =>
        processTestError('unable to update block', error, done)
      );
    });

    it('should change the value to null if is an empty string', async () => {
      input.value = '';
      await service.updateBlock(input);
      // graphQlService must be called with the right arguments
      const queryArg = graphQlSpy.calls.mostRecent().args[1];
      // the queryArg should have a valid 'updatedAt' date string
      expect(queryArg.input.value).toBe(null);
    });

    /* tslint:disable:no-string-literal */
    it(`should store the updated block's version in the query service`, done => {
      service.updateBlock(input).then(() => {
        // The version must be stored
        expect(service['blockQueryService']['myVersions']
          .has(input.version)).toBe(true);
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

  });

  describe('createBlock', () => {

    it('should throw an error if the block type is not supported', done => {
      input.type = 'ABCD';
      service.createBlock(input).then(() => {
        fail('error should be thrown'); done();
      }).catch(error => {
        expect(error).toEqual('BlockType not supported');
        done();
      });
    });

    it('should return the error raised by GraphQl if unable to create', done => {
      // Setup the spy to return a certain error
      const mockError = { message: 'test' };
      graphQlSpy.and.returnValue(Promise.reject(mockError));
      // now call the service
      service.createBlock(input).then(() => {
        fail('error should be thrown'); done();
      }).catch(error => {
        expect(error).toEqual(mockError);
        done();
      });
    });

    it('should resolve with the response from backend', done => {
      service.createBlock(input).then(value => {
        // The value resolved must be the value returned by graphql
        expect(value).toEqual(backendResponse);
        done();
      });
    });

    it('should call graphQlService with the right query', done => {
      service.createBlock(input).then(() => {
        // graphQlService must be called with the right arguments
        const spyArgs = graphQlSpy.calls.mostRecent().args;
        expect(spyArgs[0]).toEqual(createTextBlock);
        done();
      });
    });

    it('should call graphQlService with the right argument', done => {
      service.createBlock(input).then(() => {
        // graphQlService must be called with the right arguments
        const queryArg = graphQlSpy.calls.mostRecent().args[1];
        // the queryArg must have the same values
        expect(queryArg.input).toEqual(input);
        done();
      });
    });

    it('should change "value" to be null if given an empty string', done => {
      // set 'value' to be an empty string
      input.value = '';
      // Now call the service
      service.createBlock(input).then(() => {
        // graphQlService must be called with the right arguments
        const queryArg = graphQlSpy.calls.mostRecent().args[1];
        // the queryArg must have the same values
        expect(queryArg.input.value).toBe(null);
        done();
      });
    });

    /* tslint:disable:no-string-literal */
    it(`should store the created block's version in the query service`, done => {
      service.createBlock(input).then(() => {
        // The version must be stored
        expect(service['blockQueryService']['myVersions']
          .has(input.version)).toBe(true);
        done();
      });
    });

    describe('(error pathways)', () => {

      const requiredParams = ['id', 'version', 'documentId', 'lastUpdatedBy'];
      runTestForMissingParams(
        requiredParams, 'createBlock', 'CreateTextBlockInput'
      );

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
            delete input[param];
          } else {
            input[param] = null;
          }
          // call the service
          service[functionName](input).then(() => {
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
