import { TestBed } from '@angular/core/testing';

import { BlockCommandService } from './block-command.service';
import { BlockType, QuestionType, CreateQuestionBlockInput } from 'src/API';
import { BehaviorSubject } from 'rxjs';
import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../../account/account-impl.service.spec';
import { CreateTextBlockInput } from '../../../../API';
import { deleteBlock } from '../../../../graphql/mutations';
import { GraphQLService } from '../../graphQL/graph-ql.service';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';

const uuidv4 = require('uuid/v4');


describe('(Integration) BlockCommandService', () => {
  const service$ = new BehaviorSubject<BlockCommandService>(null);
  let graphQlService: GraphQLService;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    });
  });

  beforeAll(() => {
    Auth.signIn(TEST_USERNAME, TEST_PASSWORD).then(() => {
      service$.next(TestBed.get(BlockCommandService));
    }).catch(error => service$.error(error));
  });

  beforeEach(() => {
    graphQlService = TestBed.get(GraphQLService);
  });

  describe('updateBlock', () => {
    it('textBlock - should update a block in the database', done => {
      const textInput = {
        id: uuidv4(),
        documentId: uuidv4(),
        version: uuidv4(),
        type: BlockType.TEXT,
        lastUpdatedBy: uuidv4(),
        value: 'from updateBlock test'
      };
      service$.subscribe(service => {
        if (service === null) { return; }
        service.createBlock(textInput).then(() => {
          textInput.value = 'UPDATED VALUE (updateBlock test)';
          // Update the block
          return service.updateBlock(textInput);
        }).then(response => {
          const updatedBlock = response.data.updateTextBlock;
          const id = updatedBlock.id;
          expect(updatedBlock.value).toEqual(textInput.value);
          // Now delete the block
          return graphQlService.query(deleteBlock, { input: { id } });
        }).then(response => {
          expect(response.data.deleteBlock.id).toEqual(textInput.id);
          done();
        }).catch(error => {
          fail('Check console for details');
          console.error(error); done();
        });
      }, error => { console.error(error); fail(); done(); });
    });

    it('QuestionBlock - should update a block in the database', done => {
      const questionInput = {
        id: uuidv4(),
        version: uuidv4(),
        type: BlockType.QUESTION,
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4(),
        question: 'QuestionBlock test',
        answers: [],
        questionType: QuestionType.PARAGRAPH,
        options: null
      };
      service$.subscribe(service => {
        if (service === null) { return; }
        service.createBlock(questionInput).then(() => {
          questionInput.question = 'This is an updated question';
          questionInput.questionType = QuestionType.CHECKBOX;
          questionInput.options = ['option 1'];
          // Update the block
          return service.updateBlock(questionInput);
        }).then(response => {
          const updatedBlock = response.data.updateQuestionBlock;
          const id = updatedBlock.id;
          expect(updatedBlock.question).toEqual(questionInput.question);
          expect(updatedBlock.questionType).toEqual(questionInput.questionType);
          expect(updatedBlock.options).toEqual(questionInput.options);
          // Now delete the block
          return graphQlService.query(deleteBlock, { input: { id } });
        }).then(response => {
          expect(response.data.deleteBlock.id).toEqual(questionInput.id);
          done();
        }).catch(error => {
          fail('Check console for details');
          console.error(error); done();
        });
      }, error => { console.error(error); fail(); done(); });
    });
  });

  describe('createBlock', () => {

    it('TextBlock - should create a block in the database', done => {
      const textInput: CreateTextBlockInput = {
        id: uuidv4(),
        version: uuidv4(),
        type: BlockType.TEXT,
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4(),
        value: 'Created in BlockCommandService test'
      };
      service$.subscribe(service => {
        if (service === null) { return; }
        service.createBlock(textInput).then(response => {
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
          return graphQlService.query(deleteBlock, { input: { id } });
        }).then(response => {
          expect(response.data.deleteBlock.id).toEqual(textInput.id);
          done();
        }).catch(error => {
          fail('Check console for more details');
          console.error(error); done();
        });
      }, error => { console.error(error); fail(); done(); });
    });

    it('QuestionBlock - should create a block in the database', done => {
      const questionInput: CreateQuestionBlockInput = {
        id: uuidv4(),
        version: uuidv4(),
        type: BlockType.QUESTION,
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4(),
        question: 'QuestionBlock test',
        answers: [],
        questionType: QuestionType.PARAGRAPH,
        options: null
      };
      service$.subscribe(service => {
        if (service === null) { return; }
        service.createBlock(questionInput).then(response => {
          const id = response.data.createQuestionBlock.id;
          const createdBlock: any = response.data.createQuestionBlock;

          // Check the created block here
          expect(createdBlock.id).toEqual(questionInput.id);
          expect(createdBlock.version).toEqual(questionInput.version);
          expect(createdBlock.type).toEqual(questionInput.type);
          expect(createdBlock.documentId).toEqual(questionInput.documentId);
          expect(createdBlock.lastUpdatedBy).toEqual(questionInput.lastUpdatedBy);
          expect(createdBlock.question).toEqual(questionInput.question);
          expect(createdBlock.answers).toEqual(questionInput.answers);
          expect(createdBlock.questionType).toEqual(questionInput.questionType);
          expect(createdBlock.options).toEqual(questionInput.options);

          // Now delete the block
          return graphQlService.query(deleteBlock, { input: { id } });
        }).then(response => {
          expect(response.data.deleteBlock.id).toEqual(questionInput.id);
          done();
        }).catch(error => {
          fail('Check console for more details');
          console.error(error); done();
        });
      }, error => { console.error(error); fail(); done(); });
    });
  });

});
