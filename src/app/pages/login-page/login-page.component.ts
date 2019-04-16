import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../../services/account/account.service';
import { Router } from '@angular/router';

export enum LoginError {
  NONE = 'NONE',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD'
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  passwordType = 'password';
  errorMessage = LoginError.NONE;
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: this.formBuilder.control('', [Validators.required, Validators.email, Validators.minLength(6)]),
      password: this.formBuilder.control('', [Validators.required, Validators.minLength(8)]),
    });
  }

  togglePassword() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
    } else {
      this.passwordType = 'password';
    }
  }

  signIn(): Promise<any> {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    return this.accountService.login(email, password).then((data) => {
      if (data === null) {
        return Promise.reject(`[loginPage]: 'Null' received from successful login`);
      } else {
        // const id = data.id;
        this.router.navigate(['dashboard']);
      }
    }).catch(error => {
      this.handleLoginError(error);
      return Promise.reject(  );
    });
  }

  private handleLoginError(error) {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    if (error.code === 'UserNotConfirmedException') {
      this.accountService.setUnverifiedUser(email, password);
      this.router.navigate(['register']);
    } else if (error.code === 'UserNotFoundException') {
      this.errorMessage = LoginError.USER_NOT_FOUND;
    } else if (error.code === 'NotAuthorizedException') {
      this.errorMessage = LoginError.INCORRECT_PASSWORD;
    } else {
      console.error('Unknown error in signIn(): ', error);
    }
  }

}
