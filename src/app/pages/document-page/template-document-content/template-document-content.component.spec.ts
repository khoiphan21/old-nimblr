import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDocumentContentComponent } from './template-document-content.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BlockType } from 'src/API';

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

  it('andNewBlock() - should emit the right value', done => {
    const type = BlockType.QUESTION;
    component.addNewBlockEvent.subscribe(value => {
      expect(value.type).toEqual(type);
      done();
    });
    component.addNewBlock({type});
  });

  it('deleteBlock() - should emit the right value', done => {
    const blockId = 'id123';
    component.deleteBlockEvent.subscribe(value => {
      expect(value).toEqual(blockId);
      done();
    });
    component.deleteBlock(blockId);
  });

  fit('should emit the new position', done => {
    const newBlocksPosition = ['id2', 'id1'];
    component.updateDocumentEvent.subscribe(value => {
      expect(value).toEqual(newBlocksPosition);
      done();
    });
    component.updateDocument(newBlocksPosition);
  });
});
