import { TestBed } from '@angular/core/testing';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { GraphQlCommandService } from './graph-ql-command.service';
import { Auth } from 'aws-amplify';

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

    it('should remove query from queue when API response', () => {

    });

    it('should clear out the queue eventually if queries are processed successfully', () => {

    });

    it('should resend the same query after timeout if there is no response from cloud API', () => {

    });
  });

  fdescribe('Unit Tests: Happy Path', () => {
    const TEST_QUERY = '';
    const TEST_PARAMETERS = '';

    let graphQlService: GraphQlCommandService;
    TestBed.configureTestingModule({});

    beforeEach(() => {
      spyOn(API, 'graphql').and.returnValue(Promise.resolve());
      graphQlService = TestBed.get(GraphQlCommandService);
    });

    // async function mockQuery(): Promise<any> {
    //   return graphQlService.query(TEST_QUERY, TEST_PARAMETERS);
    // };

    it('should return a Promise type when query is registered correctly', async () => {
      const response = graphQlService.query(TEST_QUERY, TEST_PARAMETERS);
      expect(response instanceof Promise).toBeTruthy();
    });


    it('should add in corresponding query into the queue', () => {
      // scope: test whether the promise is passed into the queue but using add
      // out scope: not the actual behaviour of the external queue service

      // REF: https://www.npmjs.com/package/p-queue
      // Set up and mock the queue
      spyOn(graphQlService['queryQueue'], 'add');
      expect(graphQlService['queryQueue'].add.calls.count()).toBe(0);

      // execute mock query 10 times and check call counts
      for (var c = 1; c <= 10; c++) {
        graphQlService.query(TEST_QUERY, TEST_PARAMETERS);
        expect(graphQlService['queryQueue'].add.calls.count()).toBe(c);
      }
    });

    fit('should send queries to queue in chronological order according to its enqueued time', () => {
      // Set up and mock the queue
      spyOn(graphQlService['queryQueue'], 'add');
      spyOn(graphqlOperation, '');
      spyOn

      // execute mock query and check whether queries are added in correct order
      // TODO: NO, not completed yet, the parameter have been chucked into add is a function
      // not numbers
      for (var c = 1; c <= 10; c++) {
        let mockParameter = c.toString();
        console.log(typeof(mockParameter));
        graphQlService.query(mockParameter, mockParameter);
        expect(graphQlService['queryQueue'].add).toHaveBeenCalledWith(mockParameter, mockParameter);
      }

    });

    it('should resolve queries in FIFO order', () => {

    });

  });

  describe('Unit Tests: Error Path', () => {
    const TEST_QUERY = '';
    const TEST_PARAMETERS = '';

    let graphQlService: GraphQlCommandService;
    TestBed.configureTestingModule({});

    beforeEach(() => {
      spyOn(API, 'graphql').and.returnValue(Promise.resolve());
      graphQlService = TestBed.get(GraphQlCommandService);
    });

    it('should return a Promise type when error', () => {
      // const value = graphQlService.query(TEST_QUERY, TEST_PARAMETERS);
    });

  });

});

