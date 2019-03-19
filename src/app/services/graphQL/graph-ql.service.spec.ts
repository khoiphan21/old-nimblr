import { GraphQLService } from './graph-ql.service';
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
});
