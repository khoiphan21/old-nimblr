import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBlockComponent } from './question-block.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { MultipleChoiceComponent } from './multiple-choice/multiple-choice.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from './checkbox/checkbox.component';

describe('QuestionBlockComponent', () => {
  let component: QuestionBlockComponent;
  let fixture: ComponentFixture<QuestionBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuestionBlockComponent,
        CheckboxComponent,
        DropdownComponent,
        MultipleChoiceComponent,
      ],
      imports: [
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
