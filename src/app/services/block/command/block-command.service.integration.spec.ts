import { TestBed } from '@angular/core/testing';

import { BlockCommandService } from '../block-command.service';
import { BlockType } from 'src/API';
import { BehaviorSubject } from 'rxjs';
import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../../account/account-impl.service.spec';
import { BlockQueryService } from '../block-query.service';
import { CreateTextBlockInput } from '../../../../API';
import { deleteBlock } from '../../../../graphql/mutations';
import { GraphQLService } from '../../graphQL/graph-ql.service';

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

  describe('updateBlock', () => {
    let input: any;

    beforeEach(() => {
      input = {
        id: uuidv4(),
        documentId: uuidv4(),
        version: uuidv4(),
        type: BlockType.TEXT,
        lastUpdatedBy: uuidv4(),
        value: 'from updateBlock test'
      };
    });

    it('should update a block in the database', done => {
      service$.subscribe(service => {
        if (service === null) { return; }
        service.createBlock(input).then(() => {
          input.value = 'UPDATED VALUE (updateBlock test)';
          // Update the block
          return service.updateBlock(input);
        }).then(response => {
          const updatedBlock = response.data.updateTextBlock;
          const id = updatedBlock.id;
          expect(updatedBlock.value).toEqual(input.value);
          // Now delete the block
          return graphQlService.query(deleteBlock, { input: { id } });
        }).then(response => {
          expect(response.data.deleteBlock.id).toEqual(input.id);
          done();
        }).catch(error => {
          fail('Check console for details');
          console.error(error); done();
        });
      }, error => { console.error(error); fail(); done(); });
    });

    
  });

  describe('createBlock', () => {

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
          fail('Check console for more details');
          console.error(error); done();
        });
      }, error => { console.error(error); fail(); done(); });
    });

  });

});
