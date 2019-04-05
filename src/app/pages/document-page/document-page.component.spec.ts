import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentPageComponent } from './document-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';

describe('DocumentPageComponent', () => {
  let component: DocumentPageComponent;
  let fixture: ComponentFixture<DocumentPageComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentPageComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
