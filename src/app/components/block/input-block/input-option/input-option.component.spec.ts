import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputOptionComponent } from './input-option.component';
import { ReactiveFormsModule, FormsModule, FormGroup, FormArray } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { InputType } from 'src/API';
import { configureTestSuite } from 'ng-bullet';
import { take } from 'rxjs/operators';

describe('InputOptionComponent', () => {
  let component: InputOptionComponent;
  let fixture: ComponentFixture<InputOptionComponent>;
  let emitValueSpy: jasmine.Spy;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ InputOptionComponent ],
      imports: [ReactiveFormsModule, FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputOptionComponent);
    component = fixture.componentInstance;
    component.currentType = InputType.TEXT;
    component.answers = [''];
    component.options = [];
    component.formGroup = new FormGroup({
      options: new FormArray([])
    });
    emitValueSpy = spyOn(component, 'emitInputValues').and.callThrough();
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
    expect(component.options.length).toBe(0);
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

    it('should setup the form if the InputType has changed', () => {
      component.ngOnChanges({
        currentType: new SimpleChange(null, InputType.MULTIPLE_CHOICE, true)
      });
      expect(formSpy).toHaveBeenCalled();
    });

    it('should emit the values if `valueUpdated` exists and its false', () => {
      component.ngOnChanges({
        valueUpdated: new SimpleChange(true, false, false)
      });
      expect(emitValueSpy).toHaveBeenCalled();
    });

    describe('manageinputTypeChange()', () => {
      it('should emit all the corresponding values if the function is called', () => {
        component.manageinputTypeChange(InputType.MULTIPLE_CHOICE, InputType.TEXT);
        expect(formSpy).toHaveBeenCalled();
        expect(emitValueSpy).toHaveBeenCalled();
      });

      it('should clear both options and answers if it is from `MULTIPLE_CHOICE` or `CHECKBOX` to `TEXT`', () => {
        component.ngOnChanges({
          currentType: new SimpleChange(InputType.MULTIPLE_CHOICE, InputType.TEXT, false)
        });
        expect(clearAnswersSpy).toHaveBeenCalled();
        expect(clearOptionsSpy).toHaveBeenCalled();
      });

      it('should clear both options and answers if it is from `MULTIPLE_CHOICE` or `CHECKBOX` to `TEXT`', () => {
        component.ngOnChanges({
          currentType: new SimpleChange(InputType.CHECKBOX, InputType.TEXT, false)
        });
        expect(clearAnswersSpy).toHaveBeenCalled();
        expect(clearOptionsSpy).toHaveBeenCalled();
      });

      it('should clear both answers if it is changing to `MULTIPLE_CHOICE`', () => {
        component.ngOnChanges({
          currentType: new SimpleChange(InputType.TEXT, InputType.MULTIPLE_CHOICE, false)
        });
        expect(clearAnswersSpy).toHaveBeenCalled();
      });

      it('should clear both answers if it is changing to `CHECKBOX`', () => {
        component.ngOnChanges({
          currentType: new SimpleChange(InputType.TEXT, InputType.CHECKBOX, false)
        });
        expect(clearAnswersSpy).toHaveBeenCalled();
      });
    });

    describe('changeToSingleOptionType()', () => {
      it('should clear the options and answers if its `MULTIPLE_CHOICE` or `CHECKBOX`', () => {
        component.changeToSingleOptionType(InputType.MULTIPLE_CHOICE);
        expect(clearAnswersSpy).toHaveBeenCalled();
        expect(clearOptionsSpy).toHaveBeenCalled();
      });

      it('should not clear the options and answers if its not `MULTIPLE_CHOICE` or `CHECKBOX`', () => {
        component.changeToSingleOptionType(InputType.TEXT);
        expect(clearAnswersSpy).not.toHaveBeenCalled();
        expect(clearOptionsSpy).not.toHaveBeenCalled();
      });
    });

  });

  describe('triggerUpdateValue', () => {

    it('should have called `emitInputValues()`', async () => {
      await component.triggerUpdateValue(0);
      expect(emitValueSpy).toHaveBeenCalled();
    });

    it('should not call block command service again for consecutive updates', async () => {
      component.triggerUpdateValue(100);
      await component.triggerUpdateValue(0);
      expect(emitValueSpy).toHaveBeenCalledTimes(1);
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

  describe('emitInputValues()', () => {
    it('should emit `answers` for TEXT type', done => {
      component.currentType = InputType.TEXT;
      component.valueToBeSaved.pipe(take(1)).subscribe((data) => {
        expect(data.hasOwnProperty('answers')).toBe(true);
        done();
      });
      component.emitInputValues();
    });

    it('should emit `answers` for TEXT type', done => {
      component.currentType = InputType.TEXT;
      component.valueToBeSaved.pipe(take(1)).subscribe((data) => {
        expect(data.hasOwnProperty('answers')).toBe(true);
        done();
      });
      component.emitInputValues();
    });

    it('should emit `answers` and `options` for MULTIPLE_CHOICE type', done => {
      component.currentType = InputType.MULTIPLE_CHOICE;
      component.valueToBeSaved.pipe(take(1)).subscribe((data) => {
        expect(data.hasOwnProperty('answers')).toBe(true);
        expect(data.hasOwnProperty('options')).toBe(true);
        done();
      });
      component.emitInputValues();
    });

    it('should emit `answers` and `options` for CHECKBOX type', done => {
      component.currentType = InputType.CHECKBOX;
      component.valueToBeSaved.pipe(take(1)).subscribe((data) => {
        expect(data.hasOwnProperty('answers')).toBe(true);
        expect(data.hasOwnProperty('options')).toBe(true);
        done();
      });
      component.emitInputValues();
    });
  });

  it('getOptionsValue() - should get the right values from the form', () => {
    component.setupForm();
    component.addNewOption();
    const options = component.getOptionsValue();
    expect(options.length).toEqual(component.options.length);
  });

  describe('toggleAnswers()', () => {

    it('should add the value into the array if it does not exist', () => {
      component.answers = [];
      component.toggleAnswers('answer 1');
      expect(component.answers.length).toBe(1);
    });

    it('should remove the value into the array if it exist', () => {
      component.answers = ['answer 1'];
      component.toggleAnswers('answer 1');
      expect(component.answers.length).toBe(0);
    });
  });

  describe('switchAnswer()', () => {

    it('should only have one answer at a time', () => {
      component.answers = [];
      component.switchAnswer('answer 1');
      expect(component.answers.length).toBe(1);
    });

    it('should replace the existing value with the new one', () => {
      component.answers = ['answer 1'];
      component.switchAnswer('answer 2');
      expect(component.answers[0]).toBe('answer 2');
    });
  });
});
