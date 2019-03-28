import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBlockComponent } from './question-block.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionOptionComponent } from './question-option/question-option.component';
import { configureTestSuite } from 'ng-bullet';
import { QuestionType, BlockType } from 'src/API';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';
import { QuestionBlock } from 'src/app/classes/question-block';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  beforeEach(() => {
    blockFactoryService = TestBed.get(BlockFactoryService);
    const block = blockFactoryService.createAppBlock(rawData);
    fixture = TestBed.createComponent(QuestionBlockComponent);
    component = fixture.componentInstance;
    spyOn(component, 'toggleOptions').and.callThrough();
    component.questionBlock = block as QuestionBlock;
    component.ngOnChanges();
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

  /* tslint:disable:no-string-literal */
  describe('updateQuestionValue', () => {
    let blockCommandSpy: jasmine.Spy;
    const emittedValue = {
      answers: [],
    };
    beforeEach(() => {
      // setup the spies
      spyOn(component['blockFactoryService'], 'createAppBlock').and.callThrough();
      blockCommandSpy = spyOn(component['blockCommandService'], 'updateBlock');
      blockCommandSpy.and.returnValues(Promise.resolve());
      component.currentType = QuestionType.PARAGRAPH;
    });

    it('should call `createAppBlock` with the right argument', async () => {
      await component.updateQuestionValue(emittedValue);
      expect(component['blockFactoryService'].createAppBlock).toHaveBeenCalledWith({
        id: component.questionBlock.id,
        type: component.questionBlock.type,
        documentId: component.questionBlock.documentId,
        createdAt: component.questionBlock.createdAt,
        lastUpdatedBy: component.questionBlock.lastUpdatedBy,
        question: component.questionBlock.question,
        answers: [],
        questionType: component.questionBlock.questionType,
        options: undefined
      });
    });

    it('should resolve with the updated block', async () => {
      const updatedBlock: QuestionBlock = await component.updateQuestionValue(emittedValue) as QuestionBlock;
      expect(updatedBlock.question).toEqual(component.questionBlock.question);
    });

    it('should call block command service with the right argument', async () => {
      const updatedBlock = await component.updateQuestionValue(emittedValue);
      expect(blockCommandSpy).toHaveBeenCalledWith(updatedBlock);
    });
  });

  /* tslint:disable:no-string-literal */
  it('should have set `valueUpdated` to be false`', async () => {
    await component.triggerUpdateValue();
    expect(component.valueUpdated).toBe(false);
  });
});
