import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCardComponent } from './document-card.component';
import { DocumentOptionsComponent } from './document-options/document-options.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentFactoryService } from '../../services/document/document-factory.service';

const uuidv4 = require('uuid/v4');

describe('DocumentCardComponent', () => {
  let component: DocumentCardComponent;
  let fixture: ComponentFixture<DocumentCardComponent>;
  let documentFactory: DocumentFactoryService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentCardComponent,
        DocumentOptionsComponent
       ],
       imports: [
         RouterTestingModule
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCardComponent);
    component = fixture.componentInstance;
    documentFactory = TestBed.get(DocumentFactoryService);
    component.document = documentFactory.createDocument({
      id: uuidv4(),
      ownerId: uuidv4()
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
