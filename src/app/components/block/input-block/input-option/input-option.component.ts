import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { InputType } from 'src/API';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-input-option',
  templateUrl: './input-option.component.html',
  styleUrls: ['./input-option.component.scss']
})
export class InputOptionComponent implements OnChanges {
  @Input() valueUpdated: boolean;
  @Input() answers: Array<string>;
  @Input() options: Array<string>;
  @Input() currentType: InputType;
  @Input() isPreviewMode: boolean;
  @Input() isMobilePreview = false;
  @Output() valueToBeSaved = new EventEmitter<object>();
  formGroup: FormGroup;
  private timeout: any;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnChanges(changes: SimpleChanges) {
    const type = changes.currentType;
    const valueUpdated = changes.valueUpdated;
    if (type) {
      this.manageinputTypeChange(type.previousValue, type.currentValue);
    }
    if (valueUpdated && valueUpdated.currentValue === false) {
      this.emitInputValues();
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
    this.setupForm();
    this.emitInputValues();
  }

  changeToSingleOptionType(previousType: InputType) {
    if (previousType === InputType.MULTIPLE_CHOICE || previousType === InputType.CHECKBOX) {
      this.clearOptions();
      this.clearAnswers();
    }
  }

  private clearOptions() {
    this.options = [];
  }

  private clearAnswers() {
    this.answers = [];
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
    this.options.push('');
    this.emitInputValues();
  }

  deleteOption(index) {
    const control = this.formGroup.controls.options as FormArray;
    control.removeAt(index);
    this.options.splice(index);
    this.emitInputValues();
  }

  setOptions() {
    const control = this.formGroup.controls.options as FormArray;
    if (this.options.length > 0) {
      for (const option of this.options) {
        control.push(this.formBuilder.group({
          option
        }));
      }
    } else {
      this.options = [];
      this.addNewOption();
    }
  }

  toggleAnswers(value: string) {
    if (this.answers.includes(value)) {
      const index = this.answers.indexOf(value);
      this.answers.splice(index, 1);
    } else {
      this.answers.push(value);
    }
    this.setupForm();
    this.emitInputValues();
  }

  switchAnswer(value: string) {
    this.clearAnswers();
    this.answers.push(value);
    this.setupForm();
    this.emitInputValues();
  }

  async triggerUpdateValue(waitTime = 500) {
    return new Promise((resolve) => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.emitInputValues();
        resolve();
      }, waitTime);
    });
  }

  /* tslint:disable:no-string-literal */
  emitInputValues() {
    const value = {};
    value['answers'] = this.answers;
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
      this.options[index] = formGroup.value.option;
      index++;
    }
    return this.options;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.options, event.previousIndex, event.currentIndex);
    this.setupForm();
    this.emitInputValues();
  }
}
