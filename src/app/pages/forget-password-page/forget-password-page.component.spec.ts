import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPasswordPageComponent } from './forget-password-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

describe('ForgetPasswordPageComponent', () => {
  let component: ForgetPasswordPageComponent;
  let fixture: ComponentFixture<ForgetPasswordPageComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetPasswordPageComponent ],
      imports: [
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetPasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
