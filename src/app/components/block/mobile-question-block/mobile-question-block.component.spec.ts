import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileQuestionBlockComponent } from './mobile-question-block.component';
import { QuestionOptionComponent } from '../question-block/question-option/question-option.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('MobileQuestionBlockComponent', () => {
  let component: MobileQuestionBlockComponent;
  let fixture: ComponentFixture<MobileQuestionBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MobileQuestionBlockComponent,
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
    fixture = TestBed.createComponent(MobileQuestionBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
