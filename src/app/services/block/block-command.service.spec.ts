import { TestBed } from '@angular/core/testing';

import { BlockCommandService } from './block-command.service';
import { BlockType } from 'src/API';
import { BehaviorSubject } from 'rxjs';
import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { BlockQueryService } from './block-query.service';
import { CreateBlockInput, CreateTextBlockInput } from '../../../API';
import { createBlock, deleteBlock, createTextBlock } from '../../../graphql/mutations';
import { GraphQLService } from '../graphQL/graph-ql.service';

const uuidv4 = require('uuid/v4');


describe('BlockCommandService', () => {
  const service$ = new BehaviorSubject<BlockCommandService>(null);
  let graphQlService: GraphQLService;
  TestBed.configureTestingModule({});

  beforeAll(() => {
    Auth.signIn(TEST_USERNAME, TEST_PASSWORD).then(() => {
      service$.next(TestBed.get(BlockCommandService));
    }).catch(error => service$.error(error));
  });

  beforeEach(() => {
    graphQlService = TestBed.get(GraphQLService);
  });

  it('should be created', () => {
    const service = TestBed.get(BlockQueryService);
    expect(service).toBeTruthy();
  });

  fdescribe('createBlock', () => {
    it('should throw an error if a param is missing when creating a text block', done => {
      const service: BlockCommandService = TestBed.get(BlockCommandService);
      const sampleErrorInput = {
        id: uuidv4(),
        version: uuidv4(),
        type: BlockType.TEXT,
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      };
      service.createBlock(sampleErrorInput).then(() => {
        fail('error should occur');
        done();
      }).catch(error => {
        expect(error.message).toEqual('Missing argument "value" in CreateTextBlockInput');
        done();
      });
    });

    it('should create a block in the database', done => {
      const input: CreateTextBlockInput = {
        id: uuidv4(),
        version: uuidv4(),
        type: BlockType.TEXT,
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4(),
        value: 'Created in BlockCommandService test'
      };
      service$.subscribe(service => {
        if (service === null) { return; }
        service.createBlock(input).then(response => {
          const id = response.data.createTextBlock.id;
          const createdBlock: any = response.data.createTextBlock;

          // Check the created block here
          expect(createdBlock.id).toEqual(input.id);
          expect(createdBlock.version).toEqual(input.version);
          expect(createdBlock.type).toEqual(input.type);
          expect(createdBlock.documentId).toEqual(input.documentId);
          expect(createdBlock.lastUpdatedBy).toEqual(input.lastUpdatedBy);
          expect(createdBlock.value).toEqual(input.value);

          // Now delete the block
          return graphQlService.query(deleteBlock, { input: { id } });
        }).then(response => {
          expect(response.data.deleteBlock.id).toEqual(input.id);
          done();
        }).catch(error => {
          fail('Error getting service');
          console.log(error); done();
        });
      }, error => { console.error(error); fail(); done(); });
    });

    /* tslint:disable:no-string-literal */
    it(`should store the created block's version in the query service`, done => {
      const input: CreateTextBlockInput = {
        id: uuidv4(),
        version: uuidv4(),
        type: BlockType.TEXT,
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4(),
        value: 'Created in BlockCommandService test'
      };
      service$.subscribe(service => {
        if (service === null) { return; }
        service.createBlock(input).then(response => {
          const version = response.data.createTextBlock.version;
          const id = response.data.createTextBlock.id;
          expect(service['blockQueryService']['myVersions'].has(version)).toBe(true);
          // Now delete the block
          return graphQlService.query(deleteBlock, { input: { id } });
        }).then(response => {
          expect(response.data.deleteBlock.id).toEqual(input.id);
          done();
        }).catch(error => {
          fail('Error getting service');
          console.log(error); done();
        });
      }, error => { console.error(error); fail(); done(); });
    });

  });

});
