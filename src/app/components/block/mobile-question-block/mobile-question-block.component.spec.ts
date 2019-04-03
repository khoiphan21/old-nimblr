import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileQuestionBlockComponent } from './mobile-question-block.component';
import { QuestionOptionComponent } from '../question-block/question-option/question-option.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { QuestionType, BlockType } from 'src/API';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';
import { QuestionBlock } from 'src/app/classes/block/question-block';
const uuidv4 = require('uuid/v4');
describe('MobileQuestionBlockComponent', () => {
  let component: MobileQuestionBlockComponent;
  let fixture: ComponentFixture<MobileQuestionBlockComponent>;
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
        MobileQuestionBlockComponent,
        QuestionOptionComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ]
    });
  });

  beforeEach(() => {
    blockFactoryService = TestBed.get(BlockFactoryService);
    const block = blockFactoryService.createAppBlock(rawData);
    fixture = TestBed.createComponent(MobileQuestionBlockComponent);
    component = fixture.componentInstance;
    spyOn(component, 'toggleOptions').and.callThrough();
    component.questionBlock = block as QuestionBlock;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectType()', () => {
    it('should change the `currentType` to the right value', () => {
      component.selectType(QuestionType.MULTIPLE_CHOICE);
      expect(component.currentType).toBe(QuestionType.MULTIPLE_CHOICE);
    });

    it('should toggle the option', () => {
      component.selectType(QuestionType.MULTIPLE_CHOICE);
      expect(component.toggleOptions).toHaveBeenCalled();
    });
  });

  /* tslint:disable:no-string-literal */
  describe('updateQuestionValueMobile', () => {
    let parentMethodSpy: jasmine.Spy;
    const emittedValue = {
      answers: [],
    };
    beforeEach(() => {
      parentMethodSpy = spyOn(component, 'updateQuestionValue');
      parentMethodSpy.and.returnValue(Promise.resolve());
    });

    it('should update the preview answers and options', async () => {
      await component.updateQuestionValueMobile(emittedValue);
      expect(component.previewAnswers).toEqual(emittedValue.answers);
      expect(component.previewOptions).toBe(undefined);
    });

    it('should call the parent method with the right argument', async () => {
      await component.updateQuestionValueMobile(emittedValue);
      expect(parentMethodSpy).toHaveBeenCalledWith(emittedValue);
    });
  });

});
