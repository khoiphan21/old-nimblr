import { GraphQLService, ListQueryResponse } from './graph-ql.service';
import { TestBed } from '@angular/core/testing';
import { API, graphqlOperation } from 'aws-amplify';

fdescribe('GraphQLService', () => {
  let service: GraphQLService;
  let apiSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(GraphQLService);
    // setup the spy
    apiSpy = spyOn(API, 'graphql');
  });

  describe('query()', () => {
    const query = 'query';
    const params = { foo: 'bar' };

    it('should cal API.graphql with the right query and params', () => {
      service.query(query, params);
      expect(apiSpy.calls.mostRecent().args[0]).toEqual(graphqlOperation(query, params));
    });

    it('should resolve with the result from backend', done => {
      // setup the spy to return a value
      const testValue = { foo: 'bar' };
      apiSpy.and.returnValue(Promise.resolve(testValue));
      // now call the service
      service.query(query, params).then(value => {
        expect(testValue).toEqual(value);
        done();
      });
    });

    it('should reject with the error thrown by backend', done => {
      // setup the spy to reject with an error
      const mockError = new Error('test');
      apiSpy.and.returnValue(Promise.reject(mockError));
      // now call the service
      service.query(query, params).catch(error => {
        const message = `Failed to send query: ${mockError.message}`;
        expect(error.message).toEqual(message);
        done();
      });
    });

  });

  describe('list()', () => {
    let sendQuerySpy: jasmine.Spy;
    const response = {
      response: { foo: 'bar' },
      items: [{ foo1: 'bar1' }],
      nextToken: null
    };
    const MOCK_LIMIT = 20;
    let listArgument: any;

    beforeEach(() => {
      sendQuerySpy = spyOn<any>(service, 'sendQueryForListing');
      // setup the mock argument
      listArgument = {
        query: 'foo',
        queryName: 'bar',
        params: { foo: 'bar', limit: null },
        limit: MOCK_LIMIT
      };
    });

    describe('sendQuery args checking', () => {
      let args: any;

      beforeEach(() => {
        // setup the mock argument
        listArgument = {
          query: 'foo',
          queryName: 'bar',
          params: { foo: 'bar' },
          limit: MOCK_LIMIT
        };
        // setup the sendQuery to return a never resolving promise
        sendQuerySpy.and.returnValue(new Promise((_, __) => { }));
        // call the service
        service.list(listArgument);
        args = sendQuerySpy.calls.mostRecent().args;
      });

      it('should call with the right query', () => {
        expect(args[0]).toEqual(listArgument.query);
      });
      it('should call with the right query', () => {
        expect(args[1]).toEqual(listArgument.queryName);
      });
      it('should call with the right params', () => {
        // modify the limit before checking
        const expectedArgument = { foo: 'bar', limit: MOCK_LIMIT };
        expect(args[2]).toEqual(expectedArgument);
      });
    });

    describe('return value checking', () => {

      beforeEach(() => {
        // setup the sendQuery to return some values
        sendQuerySpy.and.returnValue(Promise.resolve(response));
      });

      it('should return the items', done => {
        service.list(listArgument).then(value => {
          expect(value.items.length).toEqual(response.items.length);
          expect(value.items[0]).toEqual(response.items[0]);
          done();
        });
      });
      it('should return the responses', done => {
        service.list(listArgument).then(value => {
          expect(value.responses.length).toEqual(1);
          expect(value.responses[0]).toEqual(response.response);
          done();
        });
      });
      it('should return the nextToken', done => {
        service.list(listArgument).then(value => {
          expect(value.nextToken).toEqual(response.nextToken);
          done();
        });
      });
    });

    describe('listAll', () => {
      let count; // to control what value is returned by sendQueryForListing
      const TOTAL_AMOUNT = 3;

      beforeEach(() => {
        count = 1;
        sendQuerySpy.and.callFake(fakeSendQuery);
      });

      async function fakeSendQuery() {
        let nextToken = 'test';
        if (count >= TOTAL_AMOUNT) {
          nextToken = null;
        }
        const returnValue = {
          response: count, items: [count], nextToken
        };
        count++;
        return returnValue;
      }

      it('should return the right number of items', done => {
        listArgument.listAll = true;
        service.list(listArgument).then(value => {
          expect(value.items.length).toEqual(TOTAL_AMOUNT);
          done();
        });
      });
      it('should return the right number of responses', done => {
        listArgument.listAll = true;
        service.list(listArgument).then(value => {
          expect(value.responses.length).toEqual(TOTAL_AMOUNT);
          done();
        });
      });
    });

    describe('[ERROR]', () => {
      it('should throw an error if unable to send query', done => {
        // setup spy to throw an error
        const mockError = new Error('test');
        sendQuerySpy.and.returnValue(Promise.reject(mockError));
        // call service
        service.list(listArgument).catch((error: Error) => {
          const message = `GraphQLService failed to list: ${mockError.message}`;
          expect(error.message).toEqual(message);
          done();
        });
      });
    });
  });
});
