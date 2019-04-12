import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionDocumentContentComponent } from './submission-document-content.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SubmissionDocumentContentComponent', () => {
  let component: SubmissionDocumentContentComponent;
  let fixture: ComponentFixture<SubmissionDocumentContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionDocumentContentComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
