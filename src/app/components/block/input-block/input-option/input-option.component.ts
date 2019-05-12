import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { InputType } from 'src/API';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-input-option',
  templateUrl: './input-option.component.html',
  styleUrls: ['./input-option.component.scss']
})
export class InputOptionComponent implements OnChanges {
  private currentAnswers: Array<string>;
  private currentOptions: Array<string>;

  @Input() valueUpdated: boolean;
  @Input() answers: Array<string>;
  @Input() options: Array<string>;
  @Input() currentType: InputType;
  @Input() isPreviewMode: boolean;
  @Input() isMobilePreview = false;
  @Input() isInputLocked: boolean;
  @Output() valueToBeSaved = new EventEmitter<object>();
  formGroup: FormGroup;
  private timeout: any;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnChanges(changes: SimpleChanges) {
    const type = changes.currentType;

    if (changes.answers) {
      this.currentAnswers = changes.answers.currentValue.map(a => a);
    }
    if (changes.options) {
      this.currentOptions = changes.options.currentValue.map(o => o);
    }
    if (type) {
      this.manageinputTypeChange(type.previousValue, type.currentValue);
    }

    this.setupForm();
  }

  manageinputTypeChange(previousType: InputType, currentType: InputType) {
    switch (currentType) {
      case InputType.TEXT:
        this.changeToSingleOptionType(previousType);
        break;
      case InputType.MULTIPLE_CHOICE:
        if (previousType !== undefined) {
          this.clearAnswers();
        }
        break;
      case InputType.CHECKBOX:
        if (previousType !== undefined) {
          this.clearAnswers();
        }
        break;
    }
    this.emitInputValues();
  }

  changeToSingleOptionType(previousType: InputType) {
    if (previousType === InputType.MULTIPLE_CHOICE || previousType === InputType.CHECKBOX) {
      this.clearOptions();
      this.clearAnswers();
    }
  }

  private clearOptions() {
    this.currentOptions = [];
  }

  private clearAnswers() {
    this.currentAnswers = [];
  }

  setupForm() {
    this.formGroup = this.formBuilder.group({
      options: this.formBuilder.array([])
    });
    this.setOptions();
    this.formGroup.valueChanges.subscribe((data) => {
      this.triggerUpdateValue();
    });
  }

  addNewOption() {
    const control = this.formGroup.controls.options as FormArray;
    control.push(
      this.formBuilder.group({
        option: ''
      })
    );
    this.currentOptions.push('');
    this.emitInputValues();
  }

  deleteOption(index) {
    const control = this.formGroup.controls.options as FormArray;
    control.removeAt(index);
    this.currentOptions.splice(index);
    this.emitInputValues();
  }

  setOptions() {
    const control = this.formGroup.controls.options as FormArray;
    if (this.currentOptions.length > 0) {
      for (const option of this.currentOptions) {
        control.push(this.formBuilder.group({
          option
        }));
      }
    } else {
      this.currentOptions = [];
      this.addNewOption();
    }
  }

  toggleAnswers(value: string) {
    if (this.currentAnswers.includes(value)) {
      const index = this.currentAnswers.indexOf(value);
      this.currentAnswers.splice(index, 1);
    } else {
      this.currentAnswers.push(value);
    }
    this.setupForm();
    this.emitInputValues();
  }

  switchAnswer(value: string) {
    this.clearAnswers();
    this.currentAnswers.push(value);
    this.setupForm();
    this.emitInputValues();
  }

  triggerUpdateValue(waitTime = 500) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.emitInputValues();
      // resolve();
    }, waitTime);
    // return new Promise((resolve) => {
    // });
  }

  /* tslint:disable:no-string-literal */
  emitInputValues() {
    const value = {};
    value['answers'] = this.currentAnswers;
    if (this.currentType === InputType.MULTIPLE_CHOICE || this.currentType === InputType.CHECKBOX) {
      value['options'] = this.getOptionsValue();
    }
    this.valueToBeSaved.emit(value);
  }

  getOptionsValue() {
    const formArray = this.formGroup.controls.options as FormArray;
    const controls = formArray.controls;
    let index = 0;
    for (const control of controls) {
      const formGroup = control as FormGroup;
      this.currentOptions[index] = formGroup.value.option;
      index++;
    }
    return this.currentOptions;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.currentOptions, event.previousIndex, event.currentIndex);
    this.setupForm();
    this.emitInputValues();
  }
}
