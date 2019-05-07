import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlockId } from 'src/app/classes/block/block';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BlockType } from 'src/API';
import { CreateBlockEvent } from '../../../components/block/createBlockEvent';

@Component({
  selector: 'app-block-section-content',
  templateUrl: './block-section-content.component.html',
  styleUrls: ['./block-section-content.component.scss']
})
export class BlockSectionContentComponent implements OnInit {
  // isBlockOptionsShown: boolean;
  isSelectedOptionShown = false;
  mouseFocusingBlock = '';

  @Input() isOwner: boolean;
  @Input() isChildDoc: boolean;
  @Input() blockIds: Array<string>;
  @Input() isUserLoggedIn: boolean;
  @Input() focusBlockId: BlockId;
  @Output() addNewBlockEvent = new EventEmitter<CreateBlockEvent>();
  @Output() deleteBlockEvent = new EventEmitter<string>();
  @Output() updateDocumentEvent = new EventEmitter<Array<string>>();

  constructor() { }

  ngOnInit() {
  }

  addNewBlock(event: CreateBlockEvent) {
    this.addNewBlockEvent.emit(event);
  }

  addFirstBlock() {
    this.addNewBlockEvent.emit({ type: BlockType.TEXT });
  }

  deleteBlock(event: string) {
    this.deleteBlockEvent.emit(event);
  }

  updateOnHoverBlock(blockId: string) {
    if (this.isSelectedOptionShown === false) {
      this.mouseFocusingBlock = blockId;
    }
  }

  clearOnHoverBlock() {
    if (this.isSelectedOptionShown === false) {
      this.mouseFocusingBlock = '';
    }
  }

  toggleSelectedOptionStatus(event: boolean) {
    this.isSelectedOptionShown = event;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.blockIds, event.previousIndex, event.currentIndex);
    this.updateDocumentEvent.emit(this.blockIds);
  }
}
