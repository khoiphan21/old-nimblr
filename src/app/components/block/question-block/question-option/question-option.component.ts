import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { QuestionType } from 'src/API';

@Component({
  selector: 'app-question-option',
  templateUrl: './question-option.component.html',
  styleUrls: ['./question-option.component.scss']
})
export class QuestionOptionComponent implements OnChanges {
  @Input() valueUpdated: boolean;
  @Input() answers: Array<string>;
  @Input() options: Array<string>;
  @Input() currentType: QuestionType;
  @Input() isPreviewMode: boolean;
  @Output() valueToBeSaved = new EventEmitter<object>();
  formGroup: FormGroup;
  private timeout: any;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnChanges(changes: SimpleChanges) {
    const type = changes.currentType;
    const valueUpdated = changes.valueUpdated;
    if (type) {
      this.manageQuestionTypeChange(type.previousValue, type.currentValue);
    }
    if (valueUpdated && valueUpdated.currentValue === false) {
      this.emitQuestionValues();
    }
    this.setupForm();
  }

  manageQuestionTypeChange(previousType: QuestionType, currentType: QuestionType) {
    switch (currentType) {
      case QuestionType.PARAGRAPH:
        this.changeToSingleOptionType(previousType);
        break;
      case QuestionType.SHORT_ANSWER:
        this.changeToSingleOptionType(previousType);
        break;
      case QuestionType.MULTIPLE_CHOICE:
        this.clearAnswers();
        break;
      case QuestionType.CHECKBOX:
        this.clearAnswers();
        break;
    }
    this.setupForm();
    this.emitQuestionValues();
  }

  changeToSingleOptionType(previousType: QuestionType) {
    if (previousType === QuestionType.MULTIPLE_CHOICE || previousType === QuestionType.CHECKBOX) {
      this.clearOptions();
      this.clearAnswers();
    }
  }

  private clearOptions() {
    this.options = null;
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
    this.emitQuestionValues();
  }

  deleteOption(index) {
    const control = this.formGroup.controls.options as FormArray;
    control.removeAt(index);
    this.options.splice(index);
    this.emitQuestionValues();
  }

  setOptions() {
    const control = this.formGroup.controls.options as FormArray;
    if (this.options) {
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
    this.emitQuestionValues();
  }

  switchAnswer(value: string) {
    this.clearAnswers();
    this.answers.push(value);
    this.emitQuestionValues();
  }

  async triggerUpdateValue() {
    return new Promise((resolve) => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.emitQuestionValues();
        resolve();
      }, 500);
    });
  }

  /* tslint:disable:no-string-literal */
  emitQuestionValues() {
    const value = {};
    value['answers'] = this.answers;
    if (this.currentType === QuestionType.MULTIPLE_CHOICE || this.currentType === QuestionType.CHECKBOX) {
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
}
