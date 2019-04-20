import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentOptionsComponent } from './document-options.component';
import { configureTestSuite } from 'ng-bullet';

describe('DocumentOptionsComponent', () => {
  let component: DocumentOptionsComponent;
  let fixture: ComponentFixture<DocumentOptionsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
