import { TestBed } from '@angular/core/testing';

import { GraphQLService } from './graph-ql.service';
import { take, skip } from 'rxjs/operators';
import { CreateTextBlockInput, BlockType, UpdateTextBlockInput, UpdateBlockInput } from '../../../API';
import { createTextBlock, deleteBlock, updateTextBlock, updateBlock } from '../../../graphql/mutations';
import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { onUpdateBlockInDocument } from '../../../graphql/subscriptions';
import { BehaviorSubject } from 'rxjs';
import { Block } from 'src/app/classes/block';

const uuidv4 = require('uuid/v4');

fdescribe('GraphQLService', () => {
  const service$ = new BehaviorSubject<GraphQLService>(null);

  let input: CreateTextBlockInput;

  beforeAll(() => {
    TestBed.configureTestingModule({});
    Auth.signIn(TEST_USERNAME, TEST_PASSWORD).then(() => {
      service$.next(TestBed.get(GraphQLService));
    });
  });

  beforeEach(() => {
    input = {
      version: uuidv4(),
      type: BlockType.TEXT,
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      value: 'TextBlock created from test'
    };
  });

  it('should be created', () => {
    const service: GraphQLService = TestBed.get(GraphQLService);
    expect(service).toBeTruthy();
  });

  it('should create, update and delete a text block in the database', done => {
    let id: string;
    let updateBlockInput: UpdateTextBlockInput;
    service$.subscribe(service => {
      if (service === null) { return; }
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

  it('should get subscription for updateTextBlock mutation', done => {
    let blockId: string;
    service$.subscribe(service => {
      if (service === null) { return; }
      // First create a block for testing
      service.query(createTextBlock, { input }).then(response => {
        const createdBlock: Block = response.data.createTextBlock;
        const documentId = createdBlock.documentId;
        blockId = createdBlock.id; // store the id to delete later
        // update the block
        const updateBlockInput: UpdateBlockInput = {
          id: createdBlock.id,
          version: uuidv4(),
          lastUpdatedBy: uuidv4(),
          value: '(Update TextBlock test)'
        };
        // Setup subscription
        service.getSubscription(onUpdateBlockInDocument, { documentId }).pipe(take(1)).subscribe(update => {
          const block = update.value.data.onUpdateBlockInDocument;
          expect(block.version).toEqual(updateBlockInput.version);
          expect(block.lastUpdatedBy).toEqual(updateBlockInput.lastUpdatedBy);
          expect(block.value).toEqual(updateBlockInput.value);
          done();
        });
        return new Promise((resolve, reject) => {
          // this delay is require to make sure that 
          // the subscription is set up properly first
          setTimeout(() => {
            service.query(updateTextBlock, { input: updateBlockInput })
              .then(() => resolve())
              .catch(error => reject(error));
          }, 500);
        });
      }).then(() => {
        return service.query(deleteBlock, { input: { id: blockId } });
      }).catch(error => { fail(error); done(); });

    });
  });
});
