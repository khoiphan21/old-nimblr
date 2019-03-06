import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget-password-page',
  templateUrl: './forget-password-page.component.html',
  styleUrls: ['./forget-password-page.component.scss']
})
export class ForgetPasswordPageComponent implements OnInit {
  forgetForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.forgetForm = this.formBuilder.group({
      email: this.formBuilder.control('', [Validators.required, Validators.email, Validators.minLength(6)]),
    });
  }

}
