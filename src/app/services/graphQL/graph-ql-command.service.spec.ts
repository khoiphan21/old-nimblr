import { TestBed } from '@angular/core/testing';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { GraphQlCommandService } from './graph-ql-command.service';
import { Auth } from 'aws-amplify';
import { resolve } from 'path';


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
      // graphQlService = TestBed.get(GraphQlCommandService);
      graphQlService = TestBed.get(GraphQlCommandService);
    });

    it('should return a Promise type when query is registered correctly', () => {
      const value = graphQlService.query(TEST_QUERY, TEST_PARAMETERS);
      expect(value instanceof Promise).toBeTruthy();
    });

    it('should return a Promise type when error', () => {
      // const value = graphQlService.query(TEST_QUERY, TEST_PARAMETERS);
    });

    fit('should stack up the queue when new query comes in', () => {
      // const service = graphQlService.query(TEST_QUERY, TEST_PARAMETERS);
      // // step1: internal graphQlService param check
      // expect(graphQlService["queryQueue"].length()).toBe(0);

      // // step2: enquery query
      // graphQlService.query(TEST_QUERY, TEST_PARAMETERS);

      // // step3: mock sendQuery behaviour

      // // step4: internal graphQlService param check again
      // expect(graphQlService["queryQueue"].length()).toBe(1);

      // SEE: https://www.npmjs.com/package/p-queue
      const PQueue = require('p-queue');
      const queue = new PQueue({ concurrency: 2 });

      async function unicornTask() {
        console.log('unicorn task received...');
        return new Promise((resolve, _) => {
          setTimeout(() => {
            resolve('resolved yeah');
          }, 5000);

        });
      };

      console.log('queue start', queue);

      queue.add(() => unicornTask()).then(() => {
        console.log('Done: task1');
      });

      queue.add(() => unicornTask()).then(() => {
        console.log('Done: task2');
      });

      console.log('queue end', queue);
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

