import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionOptionComponent } from './question-option.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('QuestionOptionComponent', () => {
  let component: QuestionOptionComponent;
  let fixture: ComponentFixture<QuestionOptionComponent>;
  let options: any;
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
    options = component.formGroup.controls.options;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('addNewOption() - should add a new field into the form group', () => {
    const optionCount = options.controls.length;
    component.addNewOption();
    const newOptionCount = options.controls.length;
    expect(newOptionCount).toBe(optionCount + 1);
  });

  it('deleteOption() - should remove a field from the form group', () => {
    const optionCount = options.controls.length;
    component.deleteOption(0);
    const newOptionCount = options.controls.length;
    expect(newOptionCount).toBe(optionCount - 1);
  });
});
