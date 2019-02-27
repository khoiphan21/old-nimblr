import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../../services/account/account.service';
import { Router } from '@angular/router';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getUser } from '../../../graphql/queries';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  passwordType = 'password';
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

  signIn() {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    this.accountService.login(email, password).then(() => {
      this.router.navigate(['dashboard']);
    }).catch(error => {
      alert('An unknown error occurred. Open Console for details');
      console.error(error);
    });
  }


}
