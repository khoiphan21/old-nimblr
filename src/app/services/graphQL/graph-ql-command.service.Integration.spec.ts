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

  describe('Integration Tests', () => {
    let graphQlService: any;
    let TestBlockId = "test123";
    let PARAMETERS: object;

    TestBed.configureTestingModule({});

    async function makeSureThereIsATestDataInDB() {
      PARAMETERS = { id: TestBlockId };

      const response: any = await API.graphql(graphqlOperation(getBlock, PARAMETERS));
      console.log('makeSureThereIsATestDataInDB is running...', response);

      if (response.data.getBlock === null) {
        PARAMETERS = {
          input:
          {
            id: TestBlockId,
            version: 'dummy',
            value: 'dummy'
          }
        };

        const graphqlResponse = await API.graphql(graphqlOperation(createBlock, PARAMETERS));
        console.log('block doesnt exist... create block: ', graphqlResponse);
      } else {
        console.log('block exist... keep going...');
      }
    }

    beforeAll(async () => {
      console.log('user login: ', await Auth.signIn(TEST_USERNAME, TEST_PASSWORD));
      await makeSureThereIsATestDataInDB();
    });

    beforeEach(() => {
      graphQlService = TestBed.get(GraphQlCommandService);
    });

    afterAll(async () => {
      console.log('afterAll runs...');
      PARAMETERS = { id: TestBlockId };
      const graphqlResponse = await API.graphql(graphqlOperation(deleteBlock, { input: PARAMETERS }));
      console.log('block deleted: ', graphqlResponse);
      Auth.signOut();
      console.log('afterAll have been performed');
    });


    it('should perform the corresponding query in backend with correct values', async () => {
      let graphqlResponse: any;
      let QUERY: any;
      let PARAMETERS: object;

      // check db not updated
      PARAMETERS = { id: TestBlockId };
      graphqlResponse = await API.graphql(graphqlOperation(getBlock, PARAMETERS));
      console.log('1 get block: ', graphqlResponse.data.getBlock);

      const initialVersion = graphqlResponse.data.getBlock.version;
      const initialValue = graphqlResponse.data.getBlock.value;

      // ------------------------------------------
      // Actual Query -- update value (random value)
      PARAMETERS = {
        id: TestBlockId,
        version: 'random',
        type: 'TEXT',
        documentId: 'random',
        lastUpdatedBy: 'random',
        updatedAt: 'random',
        value: 'random'
      };

      // PARAMETERS = { id: TestBlockId };
      graphqlResponse = graphQlService.query(updateTextBlock, { input: PARAMETERS });
      console.log(graphqlResponse);
      await graphqlResponse.then(msg => {
        console.log('2.1 after enqueued:', msg);
      });

      // ------------------------------------------
      // check db updated with correct value
      PARAMETERS = { id: TestBlockId };
      graphqlResponse = await API.graphql(graphqlOperation(getBlock, PARAMETERS));
      console.log('3 get block: ', graphqlResponse.data.getBlock);

      const afterVersion = graphqlResponse.data.getBlock.version;
      const afterValue = graphqlResponse.data.getBlock.value;

      expect((initialVersion !== afterVersion)).toBeTruthy();
      expect((initialValue !== afterValue)).toBeTruthy();
    });

    it('should resend the same query after timeout if there is no response from cloud API', () => {
      // skip for now
    });
  });

});

