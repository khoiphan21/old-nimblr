import { TestBed } from '@angular/core/testing';

import { GraphQLService } from './graph-ql.service';
import { take } from 'rxjs/operators';
import { CreateTextBlockInput, BlockType, UpdateTextBlockInput } from '../../../API';
import { createTextBlock, createBlock, deleteBlock, updateBlock, updateTextBlock } from '../../../graphql/mutations';
import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';

const uuidv4 = require('uuid/v4');

fdescribe('GraphQLService', () => {
  let service: GraphQLService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(GraphQLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create, update and delete a text block in the database', done => {
    let id: string;
    let updateBlockInput: UpdateTextBlockInput;
    const input: CreateTextBlockInput = {
      version: uuidv4(),
      type: BlockType.TEXT,
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      value: 'TextBlock created from test'
    };
    Auth.signIn(TEST_USERNAME, TEST_PASSWORD).then(() => {
      // Create a block for testing
      service.query(createTextBlock, { input }).then(response => {
        // Store the id to delete the block
        id = response.data.createTextBlock.id;
        expect(response.data.createTextBlock !== null).toBe(true);
        // update the block
        updateBlockInput = {
          id,
          version: uuidv4(),
          lastUpdatedBy: uuidv4(),
          value: '(Update TextBlock test)'
        };
        return service.query(updateTextBlock, { input: updateBlockInput });
      }).then(response => {
        const updatedBlock = response.data.updateTextBlock;
        expect(updatedBlock.value).toEqual(updateBlockInput.value);
        expect(updatedBlock.version).toEqual(updateBlockInput.version);
        expect(updatedBlock.lastUpdatedBy).toEqual(updateBlockInput.lastUpdatedBy);
        // now delete the created block
        return service.query(deleteBlock, { input: { id } });
      }).then(response => {
        const deletedBlockId = response.data.deleteBlock.id;
        expect(deletedBlockId).toEqual(id);
        done();
      }).catch(error => { fail(error); done(); });
    });
  });

  // it('should subscribe successfully to onBlockUpdate', done => {
  //   // Setup subscription
  //   service.subscribe().pipe(take(1)).subscribe(response => {
  //     console.log(response);
  //     fail();
  //     done();
  //   });
  //   // Then call update on the test text block
  //   service.query()

  // })
});
