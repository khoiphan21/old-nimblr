import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDocumentContentComponent } from './template-document-content.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TemplateDocumentContentComponent', () => {
  let component: TemplateDocumentContentComponent;
  let fixture: ComponentFixture<TemplateDocumentContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateDocumentContentComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDocumentContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
