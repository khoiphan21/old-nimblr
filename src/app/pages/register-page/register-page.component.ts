import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  registerForm: FormGroup;
  steps = 'three';
  passwordType = 'password';
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.registerForm = this.formBuilder.group({
      email: this.formBuilder.control('', [Validators.required, Validators.email, Validators.minLength(6)]),
      firstName: this.formBuilder.control('', [Validators.required, Validators.minLength(4)]),
      lastName: this.formBuilder.control('', [Validators.required, Validators.minLength(4)]),
      password: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
      verificationCode: this.formBuilder.control('', [Validators.required, Validators.pattern('')])
    });
  }

  togglePassword() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
    } else {
      this.passwordType = 'password';
    }
  }

  registerAccount() {
    const email = this.registerForm.get('email').value;
    const firstName = this.registerForm.get('firstName').value;
    const lastName = this.registerForm.get('lastName').value;
    const password = this.registerForm.get('password').value;
  }

}
