import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCardComponent } from './document-card.component';
import { DocumentOptionsComponent } from './document-options/document-options.component';

describe('DocumentCardComponent', () => {
  let component: DocumentCardComponent;
  let fixture: ComponentFixture<DocumentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentCardComponent,
        DocumentOptionsComponent
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
