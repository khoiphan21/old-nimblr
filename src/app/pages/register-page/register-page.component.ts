import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AccountService, UnverifiedUser } from '../../services/account/account.service';
import { CognitoSignUpUser } from '../../classes/user';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  // Params from route
  routeDocumentId: string;

  registerForm: FormGroup;
  verificationForm: FormGroup;
  steps = 'one';

  // For password input
  passwordType = 'password';
  password = '';
  hasUpperCase = false;
  hasLowerCase = false;
  hasNumber = false;
  hasLength = false;

  uuid: string;
  newCognitoUser: CognitoSignUpUser = {
    username: '',
    password: '',
    attributes: null
  };

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.checkUserVerification();
    this.buildForm();
    this.checkRouteParams();
  }

  private checkRouteParams() {
    this.route.paramMap.subscribe(params => {
      const email = params.get('email');
      this.routeDocumentId = params.get('document');

      // now check to see if the email given is valid
      if (typeof email === 'string') {
        this.steps = 'two';
        this.registerForm.get('email').setValue(email);
      }
    });
  }

  private checkUserVerification() {
    const unverifiedAccount: UnverifiedUser = this.accountService.getUnverifiedUser();
    if (unverifiedAccount !== null) {
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

  registerAccountInAws(): Promise<any> {
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
    return this.accountService.registerCognitoUser(this.newCognitoUser).then((data) => {
      this.uuid = data.userSub;
      this.steps = 'three';
      return Promise.resolve();
    });
  }

  verifyAccount(): Promise<any> {
    const verificationcode = this.verificationForm.get('verificationCode').value;
    const email = this.newCognitoUser.username;
    return this.accountService.awsConfirmAccount(email, verificationcode).then(() => {
      this.createAccountInDatabase();
      return Promise.resolve();
    }).catch(error => {
      return Promise.reject();
    });
  }

  async createAccountInDatabase(): Promise<any> {
    try {
      if (this.newCognitoUser.attributes === null) {
        this.getCognitoUserDetails();
      } else {
        await this.accountService.registerAppUser(this.newCognitoUser, this.uuid);
        this.router.navigate([`/dashboard`]);
        return Promise.resolve();
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getCognitoUserDetails(): Promise<any> {
    const username = this.newCognitoUser.username;
    const password = this.newCognitoUser.password;
    return Auth.signIn(username, password).then(() => {
      return Auth.currentAuthenticatedUser({ bypassCache: false });
    }).catch(error => {
      return Promise.reject();
    }).then(user => {
      const details = user.attributes;
      this.setNewCognitoUser(details);
      return this.createAccountInDatabase();
    }).catch(error => {
      return Promise.reject();
    });
  }

  private setNewCognitoUser(value: any) {
    this.uuid = value.sub;
    this.newCognitoUser.attributes = {
      email: `${value.email}`,
      given_name: `${value.firstName}`,
      family_name: `${value.lastName}`
    };
  }

  /* tslint:disable:no-string-literal */
  validatePassword() {
    this.registerForm.controls['password'].valueChanges.subscribe(value => {
      this.hasLowerCase = this.checkLowerCase(value);
      this.hasUpperCase = this.checkUpperCase(value);
      this.hasNumber = this.checkNumber(value);
      this.hasLength = this.checkLength(value);
    });
  }

  private checkLowerCase(value) {
    const match = value.match(/[a-z]/);
    return match !== null;
  }

  private checkUpperCase(value) {
    const match = value.match(/[A-Z]/);
    return match !== null;
  }

  private checkNumber(value) {
    const match = value.match(/\d/);
    return match !== null;
  }
  private checkLength(value) {
    return value.length > 7;
  }

}
