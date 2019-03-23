import { GraphQLService, ListQueryResponse } from './graph-ql.service';
import { TestBed } from '@angular/core/testing';
import { API, graphqlOperation } from 'aws-amplify';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

describe('GraphQLService', () => {
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
      const message = 'test';
      apiSpy.and.returnValue(Promise.reject({
        errors: [{message}]
      }));
      // now call the service
      service.query(query, params).catch(error => {
        const errorMessage = `Failed to send query: ${message}`;
        expect(error.message).toEqual(errorMessage);
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
        sendQuerySpy.and.returnValue(new Promise(() => { }));
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
      it('should automatically set the limit to 10 if not given', () => {
        // remove limit
        delete listArgument.limit;
        // call the service
        service.list(listArgument);
        args = sendQuerySpy.calls.mostRecent().args;
        const expectedArgument = { foo: 'bar', limit: 10 };
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
        const message = 'test';
        sendQuerySpy.and.returnValue(Promise.reject({
          errors: [{message}]
        }));
        // call service
        service.list(listArgument).catch((error: Error) => {
          const errorMessage = `GraphQLService failed to list: ${message}`;
          expect(error.message).toEqual(errorMessage);
          done();
        });
      });
    });
  });

  describe('sendQueryForListing()', () => {
    const listArgument = {
      query: 'foo',
      queryName: 'bar',
      params: { foo: 'bar' }
    };
    const items = [];
    const nextToken = null;
    const response = { data: { bar: { items, nextToken } } };

    beforeEach(() => {
      apiSpy.and.returnValue(Promise.resolve(response));
    });

    /* tslint:disable:no-string-literal */
    it('should resolve with the right values', done => {
      service['sendQueryForListing'](
        listArgument.query,
        listArgument.queryName,
        listArgument.params,
      ).then(result => {
        expect(result.response).toEqual(response);
        expect(result.items.length).toBe(0);
        expect(result.nextToken).toBe(null);
        done();
      });
    });
  });

  describe('getSubscription', () => {
    let backendSubject: Subject<any>;
    const query = 'subscribe';
    const params = { foo: 'bar' };

    beforeEach(() => {
      backendSubject = new Subject();
      // setup the spy to return an expected observable
      apiSpy.and.returnValue(backendSubject);
    });

    it('should call with the right arguments', () => {
      service.getSubscription(query, params);
      expect(apiSpy.calls.mostRecent().args[0]).toEqual(graphqlOperation(query, params));
    });

    it('should notify with the value from backend', done => {
      const testValue = { bar: 'foo' };
      service.getSubscription(query, params).pipe(take(1)).subscribe(value => {
        expect(value).toEqual(testValue);
        done();
      });
      backendSubject.next(testValue);
    });

    it('should throw and error if backend fails', done => {
      const message = 'test';
      service.getSubscription(query, params).subscribe(() => { }, error => {
        const errorMessage = `GraphQLService failed to subscribe: ${message}`;
        expect(error.message).toEqual(errorMessage);
        done();
      });
      backendSubject.error({
        errors: [{message}]
      });
    });
  });
});
