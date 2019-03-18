import { TestBed } from '@angular/core/testing';
import { GraphQlCommandService } from './graph-ql-command.service';

import { API, graphqlOperation } from 'aws-amplify';

fdescribe('GraphQlCommandService - Unit Tests', () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphQlCommandService = TestBed.get(GraphQlCommandService);
    expect(service).toBeTruthy();
  });

  describe('Happy Path', () => {
    const TEST_QUERY = '';
    const TEST_PARAMETERS = '';

    let graphQlService: any;
    TestBed.configureTestingModule({});

    beforeEach(() => {
      spyOn(API, 'graphql').and.returnValue(Promise.resolve());
      graphQlService = TestBed.get(GraphQlCommandService);
    });

    it('should return a Promise type when query is registered correctly', async () => {
      const response = graphQlService.query(TEST_QUERY, TEST_PARAMETERS);
      expect(response instanceof Promise).toBeTruthy();
    });

    /* tslint:disable:no-string-literal */
    it('should add in corresponding query into the queue', () => {
      // REF: https://www.npmjs.com/package/p-queue
      // Set up and mock the queue
      spyOn(graphQlService['queryQueue'], 'add');
      expect(graphQlService['queryQueue'].add.calls.count()).toBe(0);

      // execute mock query 10 times and check call counts
      for (let c = 1; c <= 10; c++) {
        graphQlService.query(TEST_QUERY, TEST_PARAMETERS);
        expect(graphQlService['queryQueue'].add.calls.count()).toBe(c);
      }
    });

    it('should send queries to queue in chronological order according to its enqueued time', () => {
      // Set up and mock the queue
      spyOn(graphQlService['queryQueue'], 'add');
      spyOn(graphQlService, 'enqueueQuery');

      // execute mock query and check whether queries are added in correct order
      // TODO: NO, not completed yet, the parameter have been chucked into add is a function
      // not numbers
      for (let c = 1; c <= 10; c++) {
        const mockParameter = c.toString();
        const expectedResult = { p: mockParameter, q: mockParameter };

        graphQlService.query(mockParameter, mockParameter);
        expect(graphQlService['enqueueQuery']).toHaveBeenCalledWith(expectedResult);
      }

    });

  });

  describe('Error Path', () => {
    const TEST_QUERY = '';
    const TEST_PARAMETERS = '';

    let graphQlService: any;
    TestBed.configureTestingModule({});

    beforeEach(() => {
      spyOn(API, 'graphql').and.returnValue(Promise.resolve());
      graphQlService = TestBed.get(GraphQlCommandService);
    });

    it('should return a Promise type when error then get rejection', () => {
      const service = TestBed.get(GraphQlCommandService);
      spyOn(graphQlService, 'enqueueQuery').and.callFake(() => {
        throw new Error('some random errors');
      });
      const response = graphQlService.query(TEST_QUERY, TEST_PARAMETERS);
      expect(response instanceof Promise).toBeTruthy();

    });

  });

});

