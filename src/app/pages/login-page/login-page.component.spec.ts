import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ServicesModule } from '../../modules/services.module';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPageComponent ],
      imports: [
        ReactiveFormsModule,
        ServicesModule,
        MDBBootstrapModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ]
    })
    .compileComponents();

    spyOn(TestBed.get(Router), 'navigate');

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
