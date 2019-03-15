import { TestBed } from '@angular/core/testing';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { GraphQlCommandService } from './graph-ql-command.service';
import { Auth } from 'aws-amplify';

import { updateTextBlock, createBlock, deleteBlock } from '../../../graphql/mutations';
import { getBlock } from '../../../graphql/queries';

// Injected service
import { API, graphqlOperation } from 'aws-amplify';
import { Input } from '@angular/core';


export class mockGraphqlService {
  enqueryQuery() {
    return Promise.reject(false);
  }
}

describe('GraphQlCommandService', () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphQlCommandService = TestBed.get(GraphQlCommandService);
    expect(service).toBeTruthy();
  });

  describe('Unit Tests: Happy Path', () => {
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


    it('should add in corresponding query into the queue', () => {
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

    it('should send queries to queue in chronological order according to its enqueued time', () => {
      // Set up and mock the queue
      spyOn(graphQlService['queryQueue'], 'add');
      spyOn(graphQlService, 'enqueueQuery');

      // execute mock query and check whether queries are added in correct order
      // TODO: NO, not completed yet, the parameter have been chucked into add is a function
      // not numbers
      for (var c = 1; c <= 10; c++) {
        const mockParameter = c.toString();
        const expectedResult = { p: mockParameter, q: mockParameter };

        console.log(expectedResult);
        graphQlService.query(mockParameter, mockParameter);
        expect(graphQlService['enqueueQuery']).toHaveBeenCalledWith(expectedResult);
      }

    });

  });

  describe('Unit Tests: Error Path', () => {
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
        throw new Error('shit');
      });
      const response = graphQlService.query(TEST_QUERY, TEST_PARAMETERS);
      expect(response instanceof Promise).toBeTruthy();

    });

  });

});

