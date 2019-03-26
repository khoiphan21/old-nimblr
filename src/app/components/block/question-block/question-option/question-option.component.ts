import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { QuestionType } from 'src/API';

@Component({
  selector: 'app-question-option',
  templateUrl: './question-option.component.html',
  styleUrls: ['./question-option.component.scss']
})
export class QuestionOptionComponent implements OnChanges {
  @Input() answers: Array<string>;
  @Input() options: Array<string>;
  @Input() currentType: QuestionType;
  @Input() isPreviewMode: boolean;
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnChanges(changes: SimpleChanges) {
    const type = changes.currentType;
    if (type) {
      this.manageQuestionTypeChange(type.previousValue, type.currentValue);
      this.setupForm();
    }
  }

  manageQuestionTypeChange(previousType: QuestionType, currentType: QuestionType) {
    switch (currentType) {
      case QuestionType.PARAGRAPH:
        return this.changeToSingleOptionType(previousType);
      case QuestionType.SHORT_ANSWER:
        return this.changeToSingleOptionType(previousType);
      case QuestionType.MULTIPLE_CHOICE:
        return this.clearAnswers();
      case QuestionType.CHECKBOX:
        return this.clearAnswers();
    }
  }

  changeToSingleOptionType(previousType: QuestionType) {
    if (previousType === QuestionType.MULTIPLE_CHOICE || previousType === QuestionType.CHECKBOX ) {
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
  }

  addNewOption() {
    const control = this.formGroup.controls.options as FormArray;
    this.options.push('');
    control.push(
      this.formBuilder.group({
        option: ''
      })
    );
  }

  deleteOption(index) {
    const control = this.formGroup.controls.options as FormArray;
    control.removeAt(index);
    this.options.splice(index);
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
}
