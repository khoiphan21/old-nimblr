import { TestBed } from '@angular/core/testing';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { GraphQlCommandService } from './graph-ql-command.service';
import { Auth } from 'aws-amplify';
import { resolve } from 'path';

// Injected service
import { API, graphqlOperation } from 'aws-amplify';


describe('GraphQlCommandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphQlCommandService = TestBed.get(GraphQlCommandService);
    expect(service).toBeTruthy();
  });

  describe('Integration Tests', () => {
    beforeAll(() => {
      Auth.signIn(TEST_USERNAME, TEST_PASSWORD);
    });

    beforeEach(() => { });

    it('should perform the corresponding query in backend with correct values', () => {

    });

  });

  fdescribe('Unit Tests', () => {
    const TEST_QUERY = '';
    const TEST_PARAMETERS = '';

    let graphQlService: GraphQlCommandService;
    TestBed.configureTestingModule({});

    beforeEach(() => {
      spyOn(API, 'graphql').and.returnValue(Promise.resolve());
      graphQlService = TestBed.get(GraphQlCommandService);
    });

    async function mockQuery(): Promise<any> {
      return graphQlService.query(TEST_QUERY, TEST_PARAMETERS);
    };

    it('should return a Promise type when query is registered correctly', async () => {
      const response = mockQuery();
      expect(response instanceof Promise).toBeTruthy();
    });

    // it('should return a Promise type when error', () => {
    //   const value = graphQlService.query(TEST_QUERY, TEST_PARAMETERS);
    // });

    fit('should stack up the queue when new query comes in', () => {

      // scope: test whether the promise is passed into the queue but using add
      // out scope: not the actual behaviour of the external queue service

      // Set up and mock the queue
      const spy = spyOnProperty(graphQlService, 'queryQueue');
      const spyy = spyOn(spy, 'add').and.returnValue(() => {
        console.log('adding task into queue');
      });

      // step1: internal graphQlService param check
      expect(spyy.call).toBe(0);

      // step2: enquery query
      // graphQlService.query(TEST_QUERY, TEST_PARAMETERS);

      // step4: internal graphQlService param check again
      // expect(magicmock.call).toBe(1);

      // // SEE: https://www.npmjs.com/package/p-queue
    });

    it('should resend the same query after timeout if there is no response from cloud API', () => {

    });

    it('should stores all queries in one task queue only', () => {

    });

    it('should perform queries in FIFO order', () => {

    });

    it('should store all queries in chronological order according to its registered time', () => {

    });

    it('should remove query from queue when API response', () => {

    });

    it('should resolve the corresponding Promise after API response and been removed from queue', () => {

    });

    it('should clear out the queue eventually if queries are processed successfully', () => {

    });
  });

});

