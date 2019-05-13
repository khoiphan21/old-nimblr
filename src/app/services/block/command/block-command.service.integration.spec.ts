import { TestBed } from '@angular/core/testing';

import { BlockCommandService } from './block-command.service';
import { BlockType, InputType, CreateInputBlockInput, TextBlockType } from 'src/API';
import { CreateTextBlockInput } from '../../../../API';
import { deleteBlock } from '../../../../graphql/mutations';
import { GraphQLService } from '../../graphQL/graph-ql.service';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { BlockFactoryService } from '../factory/block-factory.service';
import { BlockQueryService } from '../query/block-query.service';
import { take } from 'rxjs/operators';
import { LoginHelper } from '../../loginHelper';

const uuidv4 = require('uuid/v4');

describe('(Integration) BlockCommandService', () => {
  let service: BlockCommandService;
  let queryService: BlockQueryService;
  let blockFactory: BlockFactoryService;
  let graphQlService: GraphQLService;

  // The variable to store responses for checking
  let response: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    });
  });

  beforeAll(async () => {
    await LoginHelper.login();
  });

  beforeEach(() => {
    service = TestBed.get(BlockCommandService);
    queryService = TestBed.get(BlockQueryService);
    blockFactory = TestBed.get(BlockFactoryService);
    graphQlService = TestBed.get(GraphQLService);
  });

  describe('updateBlock()', () => {

    it('textBlock - should update a block in the database', async () => {
      const textInput = {
        id: uuidv4(),
        documentId: uuidv4(),
        version: uuidv4(),
        type: BlockType.TEXT,
        lastUpdatedBy: uuidv4(),
        value: 'from updateBlock test'
      };
      await service.createBlock(textInput);

      textInput.value = 'UPDATED VALUE (updateBlock test)';

      // Update the block
      response = await service.updateBlockLegacy(textInput);
      const updatedBlock = response.data.updateTextBlock;
      const id = updatedBlock.id;
      expect(updatedBlock.value).toEqual(textInput.value);

      // Now delete the block
      response = await graphQlService.query(deleteBlock, { input: { id } });
      expect(response.data.deleteBlock.id).toEqual(textInput.id);
    });

    it('InputBlock - should update a block in the database', async () => {
      const inputInput = {
        id: uuidv4(),
        version: uuidv4(),
        type: BlockType.INPUT,
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4(),
        answers: [],
        inputType: InputType.TEXT,
        options: null
      };

      await service.createBlock(inputInput);

      // Update the block with new details
      inputInput.inputType = InputType.CHECKBOX;
      inputInput.options = ['option 1'];
      response = await service.updateBlockLegacy(inputInput);

      // Check that the response is correct
      const updatedBlock = response.data.updateInputBlock;
      const id = updatedBlock.id;
      expect(updatedBlock.inputType).toEqual(inputInput.inputType);
      expect(updatedBlock.options).toEqual(inputInput.options);

      // Now delete the block
      response = await graphQlService.query(deleteBlock, { input: { id } });
      expect(response.data.deleteBlock.id).toEqual(inputInput.id);
    });
  });

  describe('createBlock()', () => {

    it('TextBlock - should create a block in the database', async () => {
      const textInput: CreateTextBlockInput = {
        id: uuidv4(),
        version: uuidv4(),
        type: BlockType.TEXT,
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4(),
        value: 'Created in BlockCommandService test',
        textBlockType: TextBlockType.HEADER,
      };

      // Create a block and check responses
      response = await service.createBlock(textInput);
      const id = response.data.createTextBlock.id;
      const createdBlock: any = response.data.createTextBlock;

      // Check the created block here
      expect(createdBlock.id).toEqual(textInput.id);
      expect(createdBlock.version).toEqual(textInput.version);
      expect(createdBlock.type).toEqual(textInput.type);
      expect(createdBlock.documentId).toEqual(textInput.documentId);
      expect(createdBlock.lastUpdatedBy).toEqual(textInput.lastUpdatedBy);
      expect(createdBlock.value).toEqual(textInput.value);

      // Now delete the block
      response = await graphQlService.query(deleteBlock, { input: { id } });

      expect(response.data.deleteBlock.id).toEqual(textInput.id);
    });

    it('InputBlock - should create a block in the database', async () => {
      const inputInput: CreateInputBlockInput = {
        id: uuidv4(),
        version: uuidv4(),
        type: BlockType.INPUT,
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4(),
        answers: [],
        inputType: InputType.TEXT,
        options: null
      };
      // Create a block
      response = await service.createBlock(inputInput);

      // Now check the properties
      const id = response.data.createInputBlock.id;
      const createdBlock: any = response.data.createInputBlock;
      // Check the created block here
      expect(createdBlock.id).toEqual(inputInput.id);
      expect(createdBlock.version).toEqual(inputInput.version);
      expect(createdBlock.type).toEqual(inputInput.type);
      expect(createdBlock.documentId).toEqual(inputInput.documentId);
      expect(createdBlock.lastUpdatedBy).toEqual(inputInput.lastUpdatedBy);
      expect(createdBlock.answers).toEqual(inputInput.answers);
      expect(createdBlock.inputType).toEqual(inputInput.inputType);
      expect(createdBlock.options).toEqual(inputInput.options);

      // Now delete the block
      response = await graphQlService.query(deleteBlock, { input: { id } });

      expect(response.data.deleteBlock.id).toEqual(inputInput.id);
    });
  });

  describe('duplicateBlocks()', () => {
    it('(TextBlock) should create a duplicate with all the right properties', async () => {
      const block = blockFactory.createNewTextBlock({
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });

      await runTestFor(block);
    });

    it('(InputBlock) should create a duplicate with all the right properties', async () => {
      const block = blockFactory.createNewInputBlock({
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });

      await runTestFor(block);
    });

    async function runTestFor(block) {
      const duplicatedBlocks = await service.duplicateBlocks([block]);
      const createdBlock = await getFirstBlock(duplicatedBlocks[0].id);

      // Now check that each value of the created block is the same as the original
      const ignoredProperties = ['id', 'createdAt', 'updatedAt', 'version'];
      Object.getOwnPropertyNames(createdBlock).forEach(property => {
        if (ignoredProperties.includes(property)) { return; }

        expect(`${property}: ` + block[property]).toEqual(`${property}: ` + createdBlock[property]);
      });
    }

    async function getFirstBlock(id: string) {
      return new Promise(resolve => {
        queryService.getBlock$(id).pipe(take(2)).subscribe(value => {
          if (value === null) { return; }
          resolve(value);
        });
      });
    }
  });

});
