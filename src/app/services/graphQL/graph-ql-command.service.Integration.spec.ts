import { TestBed } from '@angular/core/testing';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { GraphQlCommandService } from './graph-ql-command.service';
import { Auth } from 'aws-amplify';

import { updateTextBlock, createBlock, deleteBlock } from '../../../graphql/mutations';
import { getBlock } from '../../../graphql/queries';

// Injected service
import { API, graphqlOperation } from 'aws-amplify';
import { TextBlockType } from 'src/API';


export class mockGraphqlService {
  enqueryQuery() {
    return Promise.reject(false);
  }
}

describe('GraphQlCommandService -Integration Tests', () => {

  beforeEach(() => TestBed.configureTestingModule({}));
  it('should be created', () => {
    const service: GraphQlCommandService = TestBed.get(GraphQlCommandService);
    expect(service).toBeTruthy();
  });

  
  fdescribe('Integration Tests', () => {
    let graphQlService: any;
    let TestBlockId = "test123";
    let PARAMETERS: object;

    TestBed.configureTestingModule({});

    async function makeSureThereIsATestDataInDB() {
      PARAMETERS = { id: TestBlockId };

      const response: any = await API.graphql(graphqlOperation(getBlock, PARAMETERS));

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
      } else {
        // pass
      }
    }

    beforeAll(async () => {
      await makeSureThereIsATestDataInDB();
    });

    beforeEach(() => {
      graphQlService = TestBed.get(GraphQlCommandService);
    });

    afterAll(async () => {
      PARAMETERS = { id: TestBlockId };
      const graphqlResponse = await API.graphql(graphqlOperation(deleteBlock, { input: PARAMETERS }));
      Auth.signOut();
    });


    it('should perform the corresponding query in backend with correct values', async () => {
      let graphqlResponse: any;
      let QUERY: any;
      let PARAMETERS: object;

      // check db not updated
      PARAMETERS = { id: TestBlockId };
      graphqlResponse = await API.graphql(graphqlOperation(getBlock, PARAMETERS));

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
        value: 'random',
        textblocktype: TextBlockType.TEXT,
      };

      // PARAMETERS = { id: TestBlockId };
      graphqlResponse = await graphQlService.query(updateTextBlock, { input: PARAMETERS });

      // ------------------------------------------
      // check db updated with correct value
      PARAMETERS = { id: TestBlockId };
      graphqlResponse = await API.graphql(graphqlOperation(getBlock, PARAMETERS));

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

