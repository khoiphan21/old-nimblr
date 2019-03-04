import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AccountService } from '../../services/account/account.service';
import { CognitoSignUpUser } from '../../classes/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  registerForm: FormGroup;
  verificationForm: FormGroup;
  steps = 'one';
  passwordType = 'password';
  uuid: string;
  newCognitoUser: CognitoSignUpUser;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router
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
    });
    this.verificationForm = this.formBuilder.group({
      verificationCode: this.formBuilder.control('', [Validators.required, Validators.minLength(6)])
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

    this.newCognitoUser = {
      username: email,
      password: `${password}`,
      attributes: {
        email: `${email}`,
        given_name: `${firstName}`,
        family_name: `${lastName}`
      }
    };
    this.accountService.registerCognitoUser(this.newCognitoUser).then((data) => {
      this.uuid = data.userSub;
      this.steps = 'three';
    });
  }

  verifyAccount() {
    const verificationcode = this.verificationForm.get('verificationCode').value;
    this.accountService.registerAppUser(this.newCognitoUser, this.uuid, verificationcode).then(() => {
      this.router.navigate([`/dashboard`, this.uuid]);
    }).catch(error => {
      console.error(error);
    });
   }

}
