import { TestBed } from '@angular/core/testing';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { GraphQlCommandService, GraphQlCommandServiceImpl } from './graph-ql-command.service';
import { Auth } from 'aws-amplify';

describe('GraphQlCommandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphQlCommandService = TestBed.get(GraphQlCommandService);
    expect(service).toBeTruthy();
  });

  describe('Integration Tests', () => {
    beforeAll(() => {
      Auth.signIn(TEST_USERNAME, TEST_PASSWORD)
    });

    beforeEach(() => { });

    it('should perform the corresponding query in backend with correct values', () => {

    });

  });

  fdescribe('Unit Tests', () => {
    const testQuery = '';
    const testParameters = '';

    let graphQlService: GraphQlCommandService;
    TestBed.configureTestingModule({});

    beforeAll(() => { });
    beforeEach(async () => {
      graphQlService = await TestBed.get(GraphQlCommandService);
    });

    fit('should return a Promise type when query is registered correctly', async () => {
      console.log('1');
      graphQlService.query(testQuery, testParameters).then(value => {
        console.log('2', value);
        expect(value instanceof Promise).toBeTruthy();

      }).catch(err => {
        console.error(err);
        fail();
      })

    });

    it('should return a Promise type when error', () => {
      const value = graphQlService.query(testQuery, testParameters);
      expect(value instanceof Promise).toBeTruthy();
    });




    it('should resend the same query after timeout if there is no response from cloud API', () => {

    });

    it('should stack up the queue when new query comes in', () => {

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

