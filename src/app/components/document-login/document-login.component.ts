import { Component, OnInit } from '@angular/core';
import { LoginPageComponent } from 'src/app/pages/login-page/login-page.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { Router, ActivatedRoute } from '@angular/router';

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
    router: Router,
    route: ActivatedRoute
  ) {
    super(formBuilder, accountService, router, route);
  }

}
