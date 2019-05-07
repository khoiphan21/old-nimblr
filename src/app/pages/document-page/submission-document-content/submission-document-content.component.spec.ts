import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionDocumentContentComponent } from './submission-document-content.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BlockType } from '../../../../API';
import { take } from 'rxjs/operators';
import { CreateBlockEvent } from '../../../components/block/createBlockEvent';
import { configureTestSuite } from 'ng-bullet';

describe('SubmissionDocumentContentComponent', () => {
  let component: SubmissionDocumentContentComponent;
  let fixture: ComponentFixture<SubmissionDocumentContentComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionDocumentContentComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionDocumentContentComponent);
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
});
