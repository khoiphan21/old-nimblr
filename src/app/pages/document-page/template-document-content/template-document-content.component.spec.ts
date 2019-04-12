import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDocumentContentComponent } from './template-document-content.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CreateBlockEvent } from 'src/app/components/block/block.component';
import { BlockType } from 'src/API';
import { take } from 'rxjs/operators';

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


  it('addNewBlock() - should emit the event', done => {
    const event: CreateBlockEvent = {
      id: 'test',
      type: BlockType.TEXT
    };
    component.addNewBlockEvent.pipe(take(1)).subscribe(value => {
      expect(value).toEqual(event);
      done();
    });
    component.addNewBlock(event);
  });

  it('deleteBlock() - should emit the event', done => {
    const event = 'test';
    component.deleteBlockEvent.pipe(take(1)).subscribe(value => {
      expect(value).toEqual(event);
      done();
    });
    component.deleteBlock(event);
  });

  it('navigateToChild() - should emit the event', done => {
    const event = 'test';
    component.navigateToChildEvent.subscribe(value => {
      expect(value).toEqual(event);
      done();
    });
    component.navigateToChild(event);
  });
});
