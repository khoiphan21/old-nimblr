import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBlockComponent } from './question-block.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionOptionComponent } from './question-option/question-option.component';
import { configureTestSuite } from 'ng-bullet';
import { QuestionType, BlockType } from 'src/API';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';
import { QuestionBlock } from 'src/app/classes/question-block';
const uuidv4 = require('uuid/v4');

describe('QuestionBlockComponent', () => {
  let component: QuestionBlockComponent;
  let fixture: ComponentFixture<QuestionBlockComponent>;
  let blockFactoryService: BlockFactoryService;
  const rawData = {
    id: uuidv4(),
    type: BlockType.QUESTION,
    version: uuidv4(),
    documentId: uuidv4(),
    lastUpdatedBy: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    question: 'Is this a test value?',
    answers: [''],
    questionType: QuestionType.PARAGRAPH,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuestionBlockComponent,
        QuestionOptionComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ]
    });
  });

  beforeEach(() => {
    blockFactoryService = TestBed.get(BlockFactoryService);
    const block = blockFactoryService.createAppBlock(rawData);
    fixture = TestBed.createComponent(QuestionBlockComponent);
    component = fixture.componentInstance;
    spyOn(component, 'toggleOptions').and.callThrough();
    component.questionBlock = block as QuestionBlock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleOptions()', () => {
    it('should toggle isQuestionOptionShown() from false to true', () => {
      component.toggleOptions();
      expect(component.isQuestionOptionShown).toBe(true);
    });

    it('should toggle isQuestionOptionShown() from true to false', () => {
      component.isQuestionOptionShown = true;
      component.toggleOptions();
      expect(component.isQuestionOptionShown).toBe(false);
    });
  });

  describe('selectType()', () => {
    const event = new Event('click');
    it('should change the `currentType` to the right value', () => {
      component.selectType(QuestionType.MULTIPLE_CHOICE, event);
      expect(component.currentType).toBe('MULTIPLE_CHOICE');
    });

    it('should toggle the option', () => {
      component.selectType(QuestionType.MULTIPLE_CHOICE, event);
      expect(component.toggleOptions).toHaveBeenCalled();
    });
  });
});
