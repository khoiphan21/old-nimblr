import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionOptionComponent } from './question-option.component';
import { ReactiveFormsModule, FormsModule, FormGroup, FormArray, FormControl } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { QuestionType } from 'src/API';

describe('QuestionOptionComponent', () => {
  let component: QuestionOptionComponent;
  let fixture: ComponentFixture<QuestionOptionComponent>;
  let emitValueSpy: jasmine.Spy;
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
    emitValueSpy = spyOn(component, 'emitQuestionValues').and.callThrough();
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

    describe('manageQuestionTypeChange()', () => {
      it('should emit all the corresponding values if the type has changed', () => {
        component.ngOnChanges({
          currentType: new SimpleChange(QuestionType.MULTIPLE_CHOICE, QuestionType.MULTIPLE_CHOICE, false)
        });
        expect(emitValueSpy).toHaveBeenCalled();
      });

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

  describe('triggerUpdateValue', () => {

    it('should have call `emitQuestionValues()`', async () => {
      await component.triggerUpdateValue();
      expect(emitValueSpy).toHaveBeenCalled();
    });

    it('should not call block command service again for consecutive updates', done => {
      component.triggerUpdateValue();
      setTimeout(() => {
        component.triggerUpdateValue().then(() => {
          expect(emitValueSpy).toHaveBeenCalledTimes(1);
          done();
        });
      }, 100);
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

  describe('emitQuestionValues()', () => {
    it('should only emit `answers` for PARAGRAPH type', done => {
      component.currentType = QuestionType.PARAGRAPH;
      component.valueToBeSaved.subscribe((data) => {
        expect(data.hasOwnProperty('answers')).toBe(true);
        done();
      });
      component.emitQuestionValues();
    });

    it('should only emit `answers` for SHORT_ANSWER type', done => {
      component.currentType = QuestionType.SHORT_ANSWER;
      component.valueToBeSaved.subscribe((data) => {
        expect(data.hasOwnProperty('answers')).toBe(true);
        done();
      });
      component.emitQuestionValues();
    });

    it('should emit `answers` and `options` for MULTIPLE_CHOICE type', done => {
      component.currentType = QuestionType.MULTIPLE_CHOICE;
      component.valueToBeSaved.subscribe((data) => {
        expect(data.hasOwnProperty('answers')).toBe(true);
        expect(data.hasOwnProperty('options')).toBe(true);
        done();
      });
      component.emitQuestionValues();
    });

    it('should  emit `answers` and `options` for CHECKBOX type', done => {
      component.currentType = QuestionType.CHECKBOX;
      component.valueToBeSaved.subscribe((data) => {
        expect(data.hasOwnProperty('answers')).toBe(true);
        expect(data.hasOwnProperty('options')).toBe(true);
        done();
      });
      component.emitQuestionValues();
    });
  });

  it('getOptionsValue() - should get the right values from the form', () => {
    component.setupForm();
    component.addNewOption();
    const options = component.getOptionsValue();
    expect(options.length).toEqual(component.options.length);
  });
});
