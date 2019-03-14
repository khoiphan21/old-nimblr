import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-question-option',
  templateUrl: './question-option.component.html',
  styleUrls: ['./question-option.component.scss']
})
export class QuestionOptionComponent implements OnInit {
  @Input() currentType: string;
  @Input() isPreviewMode: boolean;
  formGroup: FormGroup;
  data = {
    options: [
      {
        checked: false,
        answer: ''
      }
    ]
  };

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      textAnswer: this.formBuilder.control(''),
      options: this.formBuilder.array([])
    });
    this.setOptions();
  }

  addNewOption() {
    const control = this.formGroup.controls.options as FormArray;
    control.push(
      this.formBuilder.group({
        checked: false,
        answer: ''
      })
    );
  }

  deleteOption(index) {
    const control = this.formGroup.controls.options as FormArray;
    control.removeAt(index);
  }

  setOptions() {
    const control = this.formGroup.controls.options as FormArray;
    this.data.options.forEach(option => {
      control.push(this.formBuilder.group({
        checked: option.checked,
        answer: option.answer
      }));
    });
  }
}
