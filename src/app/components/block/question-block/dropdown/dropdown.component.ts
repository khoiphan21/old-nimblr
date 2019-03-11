import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
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

