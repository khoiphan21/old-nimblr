import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBlockComponent } from './question-block.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionOptionComponent } from './question-option/question-option.component';

describe('QuestionBlockComponent', () => {
  let component: QuestionBlockComponent;
  let fixture: ComponentFixture<QuestionBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuestionBlockComponent,
        QuestionOptionComponent
      ],
      imports: [
        FormsModule,
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
