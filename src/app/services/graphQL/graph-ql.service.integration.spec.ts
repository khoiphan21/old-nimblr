import { TestBed } from '@angular/core/testing';

import { GraphQLService } from './graph-ql.service';
import { take } from 'rxjs/operators';
import { CreateTextBlockInput, BlockType, UpdateBlockInput, TextBlockType } from '../../../API';
import { createTextBlock, deleteBlock, updateTextBlock } from '../../../graphql/mutations';
import { onUpdateBlockInDocument } from '../../../graphql/subscriptions';
import { Block } from 'src/app/classes/block/block';
import { environment } from '../../../environments/environment';
import { listBlocks } from '../../../graphql/queries';
import { LoginHelper } from '../loginHelper';

const uuidv4 = require('uuid/v4');

describe('(Integration) GraphQLService', () => {
  TestBed.configureTestingModule({});

  let service: GraphQLService;

  let input: CreateTextBlockInput;
  let updateBlockInput: UpdateBlockInput;

  beforeEach(async () => {
    await LoginHelper.login();

    input = {
      id: uuidv4(),
      version: uuidv4(),
      type: BlockType.TEXT,
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      value: 'TextBlock created from test',
      textBlockType: TextBlockType.HEADER,
    };
    updateBlockInput = {
      id: null, // need to be updated during test
      updatedAt: new Date().toUTCString(),
      version: uuidv4(),
      lastUpdatedBy: uuidv4(),
      value: '(Update TextBlock test)'
    };

    service = TestBed.get(GraphQLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create, update and delete a text block in the database', done => {
    let id: string;
    // Create a block for testing
    service.query(createTextBlock, { input }).then(response => {
      // Store the id to delete the block
      id = response.data.createTextBlock.id;
      expect(response.data.createTextBlock !== null).toBe(true);
      // update the input id to query 'updateTextBlock'
      updateBlockInput.id = id;
      return service.query(updateTextBlock, { input: updateBlockInput });
    }).then(response => {
      const updatedBlock = response.data.updateTextBlock;
      checkUpdatedBlock(updatedBlock, updateBlockInput);
      // now delete the created block
      return service.query(deleteBlock, { input: { id } });
    }).then(response => {
      const deletedBlockId = response.data.deleteBlock.id;
      expect(deletedBlockId).toEqual(id);
      done();
    }).catch(error => { fail(error); done(); });
  });

  function checkUpdatedBlock(source, compare) {
    expect(compare.value).toEqual(source.value);
    expect(compare.version).toEqual(source.version);
    expect(compare.lastUpdatedBy).toEqual(source.lastUpdatedBy);
  }

  describe('(subscription)', () => {
    it('should notify when createTextBlock mutation happens in a document', done => {
      let blockId: string;
      const documentId = uuidv4();
      // change the default input's documentId
      input.documentId = documentId;
      // Subscribe to any changes for the given documentId
      service.getSubscription(onUpdateBlockInDocument, { documentId }).pipe(take(1)).subscribe(update => {
        const block = update.value.data.onUpdateBlockInDocument;
        checkUpdatedBlock(block, input);
        done();
      }, error => { fail(error); done(); });
      // Now create a TextBlock with that documentId
      setTimeout(() => {
        service.query(createTextBlock, { input }).then(response => {
          const createdBlock: Block = response.data.createTextBlock;
          blockId = createdBlock.id; // store the id to delete later
          // Now delete the newly created block
          return service.query(deleteBlock, { input: { id: blockId } });
        }).catch(error => { fail(error); done(); });
      }, environment.WAIT_TIME_BEFORE_UPDATE);
    }, environment.TIMEOUT_FOR_UPDATE_TEST);

    it('should notify for updateTextBlock mutation happens in the document', done => {
      let blockId: string;
      // First create a block for testing
      service.query(createTextBlock, { input }).then(response => {
        const createdBlock: Block = response.data.createTextBlock;
        const documentId = createdBlock.documentId;
        blockId = createdBlock.id; // store the id to delete later
        // update the input id to query 'updateTextBlock'
        updateBlockInput.id = blockId;
        // Setup subscription
        service.getSubscription(onUpdateBlockInDocument, { documentId }).pipe(take(1)).subscribe(update => {
          const block = update.value.data.onUpdateBlockInDocument;
          checkUpdatedBlock(block, updateBlockInput);
          done();
        });
        return new Promise((resolve, reject) => {
          // this delay is require to make sure that
          // the subscription is set up properly first
          setTimeout(() => {
            service.query(updateTextBlock, { input: updateBlockInput })
              .then(() => resolve())
              .catch(error => reject(error));
          }, environment.WAIT_TIME_BEFORE_UPDATE);
        });
      }).then(() => {
        return service.query(deleteBlock, { input: { id: blockId } });
      }).catch(error => { fail(error); done(); });
    }, environment.TIMEOUT_FOR_UPDATE_TEST);

  });

  describe('(list)', () => {

    it('should paginate through and list all blocks for a document', done => {
      // First create the blocks for testing
      const documentId = uuidv4();
      const blockIds = [];
      // Setup the input params
      const testInput = {
        version: uuidv4(),
        type: BlockType.TEXT,
        documentId,
        lastUpdatedBy: uuidv4(),
        value: '(from GraphQlService listing test)'
      };
      Promise.all([
        service.query(createTextBlock, { input: testInput }),
        service.query(createTextBlock, { input: testInput }),
        service.query(createTextBlock, { input: testInput })
      ]).then(responses => {
        responses.forEach(response => {
          blockIds.push(response.data.createTextBlock.id);
        });
        return service.list({
          query: listBlocks,
          queryName: 'listBlocks',
          params: {
            filter: {
              documentId: {
                eq: documentId
              }
            }
          },
          limit: 100, // to get only some at a time
          listAll: true
        });
      }).then(response => {
        expect(response.items.length).toEqual(3);
        expect(response.nextToken).toBe(null);
        response.items.forEach(datum => {
          expect(datum.documentId).toEqual(documentId);
        });
        // Now start deleting the blocks
        return Promise.all(blockIds.map(id => {
          return service.query(deleteBlock, { input: { id } });
        }));
      }).then(deletedBlocks => {
        expect(deletedBlocks.length).toBe(3);
        done();
      }).catch(error => { console.error(error); fail('error occurred'); done(); });
    }, environment.TIMEOUT_FOR_UPDATE_TEST);
  });

});
