import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockSectionContentComponent } from './block-section-content.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BlockType } from 'src/API';
import { take } from 'rxjs/operators';
import { CreateBlockEvent } from '../../../components/block/createBlockEvent';
import { configureTestSuite } from 'ng-bullet';

describe('BlockSectionContentComponent', () => {
  let component: BlockSectionContentComponent;
  let fixture: ComponentFixture<BlockSectionContentComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [BlockSectionContentComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockSectionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('andNewBlock() - should emit the right value', done => {
    const type = BlockType.INPUT;
    component.addNewBlockEvent.subscribe(value => {
      expect(value.type).toEqual(type);
      done();
    });
    component.addNewBlock({ type });
  });

  it('addFirstBlock() - should emit the right event', done => {
    const event: CreateBlockEvent = {
      type: BlockType.TEXT
    };
    component.addNewBlockEvent.pipe(take(1)).subscribe(value => {
      expect(value).toEqual(event);
      done();
    });
    component.addFirstBlock();
  });

  it('deleteBlock() - should emit the right value', done => {
    const blockId = 'id123';
    component.deleteBlockEvent.pipe(take(1)).subscribe(value => {
      expect(value).toEqual(blockId);
      done();
    });
    component.deleteBlock(blockId);
  });

  describe('updateOnHoverBlock', () => {
    it('should update the value if `isSelectedOptionShown` is false', () => {
      component.isSelectedOptionShown = false;
      component.mouseFocusingBlock = 'id123';
      const newId = 'id098';
      component.updateOnHoverBlock(newId);
      expect(component.mouseFocusingBlock).toEqual(newId);
    });

    it('should not update the value if `isSelectedOptionShown` is true', () => {
      component.isSelectedOptionShown = true;
      component.mouseFocusingBlock = 'id123';
      const newId = 'id098';
      component.updateOnHoverBlock(newId);
      expect(component.mouseFocusingBlock).toEqual('id123');
    });
  });

  describe('clearOnHoverBlock', () => {
    it('should clear the value if `isSelectedOptionShown` is false', () => {
      component.isSelectedOptionShown = false;
      component.mouseFocusingBlock = 'id123';
      component.clearOnHoverBlock();
      expect(component.mouseFocusingBlock).toEqual('');
    });

    it('should not clear the value if `isSelectedOptionShown` is true', () => {
      component.isSelectedOptionShown = true;
      component.mouseFocusingBlock = 'id123';
      component.clearOnHoverBlock();
      expect(component.mouseFocusingBlock).toEqual('id123');
    });
  });

  it('toggleSelectedOptionStatus() - should set it to the right value', () => {
    component.toggleSelectedOptionStatus(true);
    expect(component.isSelectedOptionShown).toBe(true);
  });

  describe('drop()', () => {
    let dragEvent;

    beforeEach(() => {
      component.blockIds = ['id1', 'id2'];
      dragEvent = {
        previousIndex: 0,
        currentIndex: 1
      } as CdkDragDrop<string[]>;
    });

    it('should move update the blockids into new postion', () => {
      component.drop(dragEvent);
      const newBlocksPosition = ['id2', 'id1'];
      expect(component.blockIds).toEqual(newBlocksPosition);
    });

    it('should emit the new position', done => {
      const newBlocksPosition = ['id2', 'id1'];
      component.updateDocumentEvent.pipe(take(1)).subscribe(value => {
        expect(value).toEqual(newBlocksPosition);
        done();
      });
      component.drop(dragEvent);
    });
  });
});
