import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss']
})
export class MultipleChoiceComponent implements OnInit {
  formGroup: FormGroup;
  selectedRadio: '';
  data = {
    options: [
      {
        answer: ''
      }
    ]
  };

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      options: this.formBuilder.array([])
    });
    this.setOptions();
  }

  addNewOption() {
    const control = this.formGroup.controls.options as FormArray;
    control.push(
      this.formBuilder.group({
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
        answer: option.answer
      }));
    });
  }
}


