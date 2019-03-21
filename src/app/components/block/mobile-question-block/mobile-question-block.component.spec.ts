import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileQuestionBlockComponent } from './mobile-question-block.component';
import { QuestionOptionComponent } from '../question-block/question-option/question-option.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

describe('MobileQuestionBlockComponent', () => {
  let component: MobileQuestionBlockComponent;
  let fixture: ComponentFixture<MobileQuestionBlockComponent>;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        MobileQuestionBlockComponent,
        QuestionOptionComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileQuestionBlockComponent);
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
    it('should change the `currentType` to the right value', () => {
      component.selectType('multiple choice');
      expect(component.currentType).toBe('multiple choice');
    });

    it('should toggle the option', () => {
      component.selectType('multiple choice');
      expect(component.toggleOptions).toHaveBeenCalled();
    });
  });
});
