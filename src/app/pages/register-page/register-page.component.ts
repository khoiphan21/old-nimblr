import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AccountService, UnverifiedUser } from '../../services/account/account.service';
import { CognitoSignUpUser } from '../../classes/user';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';

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
  newCognitoUser: CognitoSignUpUser = {
    username: '',
    password: '',
    attributes: null
  };

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.checkUserVerification();
    this.buildForm();
  }

  private checkUserVerification() {
    const unverifiedAccount: UnverifiedUser = this.accountService.getUnverifiedUser();
    if (unverifiedAccount === null) {
      this.steps = 'one';
    } else {
      const email = unverifiedAccount.email;
      const password = unverifiedAccount.password;
      this.newCognitoUser = {
        username: email,
        password: `${password}`,
        attributes: null
      };
      this.steps = 'three';
    }
  }

  private buildForm() {
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

  registerAccountInAws() {
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
    const email = this.newCognitoUser.username;
    this.accountService.awsConfirmAccount(email, verificationcode).then(() => {
      this.createAccountInDatabase();
    }).catch(error => {
      console.error('verifiyAccount()', error);
    });
  }

  createAccountInDatabase() {
      if (this.newCognitoUser.attributes === null) {
        this.getCognitoUserDetails();
      } else {
        this.accountService.registerAppUser(this.newCognitoUser, this.uuid).then(() => {
          this.router.navigate([`/dashboard`, this.uuid]);
        }).catch(error => {
          console.error(error);
        });
      }
  }

  getCognitoUserDetails(): Promise<any> {
    const username = this.newCognitoUser.username;
    const password = this.newCognitoUser.password;
    return Auth.signIn(username, password).then(() => {
      return Auth.currentAuthenticatedUser({ bypassCache: false });
    }).catch(error => {
      console.error('Login in getCognitoUserDetails()', error);
      return Promise.reject();
    }).then(user => {
      const details = user.attributes;
      this.setNewCognitoUser(details);
      this.createAccountInDatabase();
      return Promise.resolve();
    }).catch(error => {
      console.error('Get current auth user in getCognitoUserDetails()', error);
      return Promise.reject();
    });
  }

  private setNewCognitoUser(value: any) {
    const email = value.email;
    const givenName = value.phone_number;
    const familyName = value.phone_number;
    const id = value.sub;
    this.uuid = id;
    this.newCognitoUser.attributes = {
      email: `${email}`,
      given_name: `${givenName}`,
      family_name: `${familyName}`
    };
  }

}
