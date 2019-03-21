import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBlockComponent } from './question-block.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionOptionComponent } from './question-option/question-option.component';
import { configureTestSuite } from 'ng-bullet';

describe('QuestionBlockComponent', () => {
  let component: QuestionBlockComponent;
  let fixture: ComponentFixture<QuestionBlockComponent>;

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
    fixture = TestBed.createComponent(QuestionBlockComponent);
    component = fixture.componentInstance;
    spyOn(component, 'toggleOptions').and.callThrough();
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
      component.selectType('multiple choice', event);
      expect(component.currentType).toBe('multiple choice');
    });

    it('should toggle the option', () => {
      component.selectType('multiple choice', event);
      expect(component.toggleOptions).toHaveBeenCalled();
    });
  });
});
