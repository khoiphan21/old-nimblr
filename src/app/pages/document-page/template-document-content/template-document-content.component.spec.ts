import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDocumentContentComponent } from './template-document-content.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BlockType } from 'src/API';
import { configureTestSuite } from 'ng-bullet';
import { take } from 'rxjs/operators';

describe('TemplateDocumentContentComponent', () => {
  let component: TemplateDocumentContentComponent;
  let fixture: ComponentFixture<TemplateDocumentContentComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateDocumentContentComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDocumentContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('andNewBlock() - should emit the right value', done => {
    const type = BlockType.INPUT;
    component.addNewBlockEvent.pipe(take(1)).subscribe(value => {
      expect(value.type).toEqual(type);
      done();
    });
    component.addNewBlock({type});
  });

  it('deleteBlock() - should emit the right value', done => {
    const blockId = 'id123';
    component.deleteBlockEvent.pipe(take(1)).subscribe(value => {
      expect(value).toEqual(blockId);
      done();
    });
    component.deleteBlock(blockId);
  });

  describe('showInvite()', () => {
    it('should emit the event value as true', done => {
      component.showInviteEvent.pipe(take(1)).subscribe(value => {
        expect(value).toBe(true);
        done();
      });
      component.showInvite();
    });
  });

  it('should emit the new position', done => {
    const newBlocksPosition = ['id2', 'id1'];
    component.updateDocumentEvent.pipe(take(1)).subscribe(value => {
      expect(value).toEqual(newBlocksPosition);
      done();
    });
    component.updateDocument(newBlocksPosition);
  });

  it('navigateToChild() - should emit the event', done => {
    const event = 'test';
    component.navigateToChildEvent.pipe(take(1)).subscribe(value => {
      expect(value).toEqual(event);
      done();
    });
    component.navigateToChild(event);
  });
});
