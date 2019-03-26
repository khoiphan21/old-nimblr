import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionOptionComponent } from './question-option.component';
import { ReactiveFormsModule, FormsModule, FormGroup, FormArray, FormControl } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { QuestionType } from 'src/API';

describe('QuestionOptionComponent', () => {
  let component: QuestionOptionComponent;
  let fixture: ComponentFixture<QuestionOptionComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionOptionComponent ],
      imports: [ReactiveFormsModule, FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionOptionComponent);
    component = fixture.componentInstance;
    component.currentType = QuestionType.PARAGRAPH;
    component.answers = [''];
    component.options = null;
    component.formGroup = new FormGroup({
      options: new FormArray([])
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup a form and set the options', () => {
    component.formGroup = undefined;
    component.setupForm();
    expect(component.formGroup).toBeTruthy();
  });

  /* tslint:disable:no-string-literal */
  it('should clear all the options in the list', () => {
    component['clearOptions']();
    expect(component.options).toEqual(null);
  });

  /* tslint:disable:no-string-literal */
  it('should clear all the answers in the list', () => {
    component['clearAnswers']();
    expect(component.answers.length).toBe(0);
  });

  describe('ngOnChanges()', () => {
    let formSpy: jasmine.Spy;
    let clearAnswersSpy: jasmine.Spy;
    let clearOptionsSpy: jasmine.Spy;
    beforeEach(() => {
      formSpy = spyOn(component, 'setupForm');
      clearAnswersSpy = spyOn<any>(component, 'clearAnswers');
      clearOptionsSpy = spyOn<any>(component, 'clearOptions');
    });

    it('should setup the form if the QuestionType has changed', () => {
      component.ngOnChanges({
        currentType: new SimpleChange(null, QuestionType.MULTIPLE_CHOICE, true)
      });
      expect(formSpy).toHaveBeenCalled();
    });

    it('should not setup the form if the QuestionType has not changed', () => {
      component.ngOnChanges({
        isPreviewMode: new SimpleChange(null, false, true)
      });
      expect(formSpy).not.toHaveBeenCalled();
    });

    describe('manageQuestionTypeChange()', () => {
      it('should clear both options and answers if it is from `MULTIPLE_CHOICE` or `CHECKBOX` to `SHORT_ANSWER`', () => {
        component.ngOnChanges({
          currentType: new SimpleChange(QuestionType.MULTIPLE_CHOICE, QuestionType.SHORT_ANSWER, false)
        });
        expect(clearAnswersSpy).toHaveBeenCalled();
        expect(clearOptionsSpy).toHaveBeenCalled();
      });

      it('should clear both options and answers if it is from `MULTIPLE_CHOICE` or `CHECKBOX` to `PARAGRAPH`', () => {
        component.ngOnChanges({
          currentType: new SimpleChange(QuestionType.CHECKBOX, QuestionType.PARAGRAPH, false)
        });
        expect(clearAnswersSpy).toHaveBeenCalled();
        expect(clearOptionsSpy).toHaveBeenCalled();
      });

      it('should clear both answers if it is changing to `MULTIPLE_CHOICE`', () => {
        component.ngOnChanges({
          currentType: new SimpleChange(QuestionType.PARAGRAPH, QuestionType.MULTIPLE_CHOICE, false)
        });
        expect(clearAnswersSpy).toHaveBeenCalled();
      });

      it('should clear both answers if it is changing to `CHECKBOX`', () => {
        component.ngOnChanges({
          currentType: new SimpleChange(QuestionType.PARAGRAPH, QuestionType.CHECKBOX, false)
        });
        expect(clearAnswersSpy).toHaveBeenCalled();
      });
    });

    describe('changeToSingleOptionType()', () => {
      it('should clear the options and answers if its `MULTIPLE_CHOICE` or `CHECKBOX`', () => {
        component.changeToSingleOptionType(QuestionType.MULTIPLE_CHOICE);
        expect(clearAnswersSpy).toHaveBeenCalled();
        expect(clearOptionsSpy).toHaveBeenCalled();
      });

      it('should not clear the options and answers if its not `MULTIPLE_CHOICE` or `CHECKBOX`', () => {
        component.changeToSingleOptionType(QuestionType.PARAGRAPH);
        expect(clearAnswersSpy).not.toHaveBeenCalled();
        expect(clearOptionsSpy).not.toHaveBeenCalled();
      });
    });

  });

  describe('setOptions()', () => {
    it('should add a new option if there is no existing options', () => {
      component.setOptions();
      expect(component.options.length).toBe(1);
    });

    it('should add the existing option into the form group', () => {
      component.options = ['option 1', 'option 2'];
      component.setOptions();
      expect(component.options.length).toBe(2);
    });
  });

  it('addNewOption() - should add a new field into the form group', () => {
    component.options = ['option 1'];
    const optionCount = component.options.length;
    component.addNewOption();
    const newOptionCount = component.options.length;
    expect(newOptionCount).toBe(optionCount + 1);
  });

  it('deleteOption() - should remove a field from the form group', () => {
    component.options = ['option 1'];
    const optionCount = component.options.length;
    component.deleteOption(0);
    const newOptionCount = component.options.length;
    expect(newOptionCount).toBe(optionCount - 1);
  });
});
