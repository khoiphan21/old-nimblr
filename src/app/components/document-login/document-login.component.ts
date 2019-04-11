import { Component, OnInit } from '@angular/core';
import { LoginPageComponent } from 'src/app/pages/login-page/login-page.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-login',
  templateUrl: './document-login.component.html',
  styleUrls: ['./document-login.component.scss']
})
export class DocumentLoginComponent extends LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  passwordType = 'password';
  constructor(
    formBuilder: FormBuilder,
    accountService: AccountService,
    router: Router
  ) {
    super(formBuilder, accountService, router);
  }

  ngOnInit() {
    this.buildForm();
  }
}