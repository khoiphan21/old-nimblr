import { TestBed } from '@angular/core/testing';
import { GraphQlCommandService } from './graph-ql-command.service';

import { API, graphqlOperation } from 'aws-amplify';

describe('GraphQlCommandService - Unit Tests', () => {
  let service: GraphQlCommandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(GraphQlCommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('query()', () => {
    let enqueueSpy: jasmine.Spy;

    beforeEach(() => {
      // setup spy for the enqueueQuery method
      enqueueSpy = spyOn<any>(service, 'enqueueQuery');
    });

    it('should return a Promise type when query is registered correctly', async () => {
      const response = service.query('', '');
      expect(response instanceof Promise).toBeTruthy();
    });

    it('should call enqueueQuery() everytime', () => {
      const CALL_COUNT = 5;
      for (let i = 0; i < CALL_COUNT; i++) {
        service.query('', '');
      }
      // now check the spy
      expect(enqueueSpy.calls.count()).toBe(CALL_COUNT);
    });

    it('should reject when failed to enqueue', done => {
      // setup enqueueQuery to fail
      const message = 'test';
      enqueueSpy.and.returnValue(Promise.reject(new Error(message)));
      // setup expected message
      const expectedMessage = `Failed to call GraphQL Query: ${message}`;
      // call service
      service.query('', '').catch(error => {
        expect(error.message).toEqual(expectedMessage);
        done();
      });
    });

    it('should call enqueueQuery with the right argument', () => {
      // setup expected values
      const query = 'test query';
      const parameters = { value: 'test' };
      // call service
      service.query(query, parameters);
      expect(enqueueSpy.calls.mostRecent().args[0]).toEqual({ query, parameters });
    });

    it('should return the result from enqueueQuery()', done => {
      // setup spy to return a mock value
      const returnValue = { value: 'test' };
      enqueueSpy.and.returnValue(Promise.resolve(returnValue));
      // call service
      service.query('', '').then(result => {
        expect(result).toEqual(returnValue);
        done();
      });
    });

  });

  /* tslint:disable:no-string-literal */
  describe('enqueueQuery()', () => {
    let apiSpy: jasmine.Spy;
    // mock values for testing
    let testValue;
    let mockQuery: any;

    beforeEach(() => {
      // setup return values
      mockQuery = {
        query: 'queryTest',
        parameters: { value: 'test' }
      };
      testValue = { value: 'abcd' };
      // setup spies
      apiSpy = spyOn(API, 'graphql');
      apiSpy.and.returnValue(Promise.resolve(testValue));
    });

    it('should call the add() method of the queryQueue', () => {
      const addSpy = spyOn<any>(service['queue'], 'add');
      service['enqueueQuery'](mockQuery);
      expect(addSpy.calls.count()).toBe(1);
    });

    it('should resolve the response from API.graphql()', done => {
      // call service
      service['enqueueQuery'](mockQuery).then(value => {
        expect(value).toBe(testValue);
        done();
      });
    });

    it('should call API.graphql() with the right argument', done => {
      const expected = graphqlOperation(mockQuery.query, mockQuery.parameters);
      service['enqueueQuery'](mockQuery).then(() => {
        expect(apiSpy.calls.mostRecent().args[0]).toEqual(expected);
        done();
      });
    });

    it('should throw an error if API.graphql() fails', done => {
      // setup api to fail
      const message = 'test';
      apiSpy.and.returnValue(Promise.reject(new Error(message)));
      // expected message
      const expectedMessage = 'Failed to query: ' + message;
      // call service
      service['enqueueQuery'](mockQuery).catch(error => {
        expect(error.message).toEqual(expectedMessage);
        done();
      });
    });

    it('should have a pending item in the queue while API call is running', () => {
      // setup spy to return a promise that never resolves
      apiSpy.and.returnValue(new Promise(() => { }));

      service['enqueueQuery'](mockQuery);
      expect(service['queue'].pending).toBe(1);
    });

    it('should empty the queue when API call resolves', done => {
      service['enqueueQuery'](mockQuery).then(() => {
        expect(service['queue'].pending).toBe(0);
        done();
      });
    });

  });

  describe('PQueue', () => {

    describe('add()', () => {
      const testValue = 'test';

      it('should resolve with the result of the async function passed in', done => {
        async function testFunction() {
          return testValue;
        }

        service['queue'].add(testFunction).then(result => {
          expect(result).toEqual(testValue);
          done();
        });
      });

      it('should reject with the error of the async function passed in', done => {
        async function testFunction() {
          return Promise.reject(new Error(testValue));
        }

        service['queue'].add(testFunction).catch(error => {
          expect(error.message).toEqual(testValue);
          done();
        });
      });

    });

  });

});

