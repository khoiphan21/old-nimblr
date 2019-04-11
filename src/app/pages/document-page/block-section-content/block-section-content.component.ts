import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlockId } from 'src/app/classes/block/block';
import { CreateBlockEvent } from 'src/app/components/block/block.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-block-section-content',
  templateUrl: './block-section-content.component.html',
  styleUrls: ['./block-section-content.component.scss']
})
export class BlockSectionContentComponent implements OnInit {
  @Input() blockIds: Array<string>;
  @Input() isUserLoggedIn: boolean;
  @Input() focusBlockId: BlockId;

  @Output() addNewBlockEvent = new EventEmitter<CreateBlockEvent>();
  @Output() deleteBlockEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  addNewBlock(event: CreateBlockEvent) {
    this.addNewBlockEvent.emit(event);
  }

  deleteBlock(blockId: string) {
    this.deleteBlockEvent.emit(blockId);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.blockIds, event.previousIndex, event.currentIndex);
  }
}
