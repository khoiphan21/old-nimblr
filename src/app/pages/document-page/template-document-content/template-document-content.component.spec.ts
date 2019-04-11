import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDocumentContentComponent } from './template-document-content.component';

describe('TemplateDocumentContentComponent', () => {
  let component: TemplateDocumentContentComponent;
  let fixture: ComponentFixture<TemplateDocumentContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateDocumentContentComponent ]
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
