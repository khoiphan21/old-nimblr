import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockSectionContentComponent } from './block-section-content.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { take } from 'rxjs/operators';
import { CreateBlockEvent } from 'src/app/components/block/block.component';
import { BlockType } from 'src/API';

describe('BlockSectionContentComponent', () => {
  let component: BlockSectionContentComponent;
  let fixture: ComponentFixture<BlockSectionContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockSectionContentComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockSectionContentComponent);
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
