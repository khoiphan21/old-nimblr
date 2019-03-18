import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionOptionComponent } from './question-option.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('QuestionOptionComponent', () => {
  let component: QuestionOptionComponent;
  let fixture: ComponentFixture<QuestionOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionOptionComponent ],
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionOptionComponent);
    component = fixture.componentInstance;
    component.data = {
      options: [
        {
          checked: false,
          answer: ''
        }
      ]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
