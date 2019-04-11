import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionDocumentContentComponent } from './submission-document-content.component';

describe('SubmissionDocumentContentComponent', () => {
  let component: SubmissionDocumentContentComponent;
  let fixture: ComponentFixture<SubmissionDocumentContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionDocumentContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionDocumentContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
