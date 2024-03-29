import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../../services/account/account.service';
import { Router, ActivatedRoute } from '@angular/router';

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
  // Params from route
  routeDocumentId: string;

  loginForm: FormGroup;
  passwordType = 'password';
  errorMessage = LoginError.NONE;

  // control flags
  isReady = false;
  signingIn = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    try {
      await this.accountService.isUserReady();
      this.router.navigate(['/document']);
    } catch {
      this.buildForm();
      this.checkRouteParams(); // should be done after the form is built
      this.isReady = true;
    }
  }

  private checkRouteParams() {
    this.route.paramMap.subscribe(params => {
      const email = params.get('email');
      this.routeDocumentId = params.get('document');

      // now check to see if the email given is valid
      if (typeof email === 'string') {
        this.loginForm.get('email').setValue(email);
      }
    });
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

  async signIn() {
    this.signingIn = true;
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    try {
      await this.accountService.login(email, password);
      this.router.navigate([`/document/${this.routeDocumentId}`]);
    } catch (error) {
      this.signingIn = false;
      this.handleLoginError(error);
    }
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
      this.loginForm.get('password').setValue('');
      this.errorMessage = LoginError.INCORRECT_PASSWORD;
    } else {
      console.error('Unknown error in signIn(): ', error);
    }
  }

}
