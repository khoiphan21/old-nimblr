import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionRecipientComponent } from './submission-recipient.component';

describe('SubmissionRecipientComponent', () => {
  let component: SubmissionRecipientComponent;
  let fixture: ComponentFixture<SubmissionRecipientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionRecipientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
