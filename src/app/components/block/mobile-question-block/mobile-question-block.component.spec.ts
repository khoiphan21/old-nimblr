import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileQuestionBlockComponent } from './mobile-question-block.component';

describe('MobileQuestionBlockComponent', () => {
  let component: MobileQuestionBlockComponent;
  let fixture: ComponentFixture<MobileQuestionBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileQuestionBlockComponent ]
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
