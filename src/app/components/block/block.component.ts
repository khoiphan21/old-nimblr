import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Block, BlockId } from '../../classes/block/block';
import { BlockQueryService } from '../../services/block/query/block-query.service';
import { BlockType } from 'src/API';

export interface CreateBlockEvent {
  id: BlockId;
  type: BlockType;
}

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
  isBlockOptionsShown: boolean;
  isSelectedOptionShown = false;
  isFocused = false;

  block: Block;

  @Input() blockId: string;
  @Input() isUserLoggedIn: boolean;
  @Input() focusBlockId: BlockId; // To check if it should be focused

  @Output() createBlock = new EventEmitter<CreateBlockEvent>();

  @Output() deleteEvent = new EventEmitter<string>();

  constructor(
    private blockQueryService: BlockQueryService
  ) { }

  ngOnInit() {
    // check if the focus block id is the same as my id
    if (this.focusBlockId === this.blockId) {
      // if so, tell the children to focus
      this.isFocused = true;
    }
    this.blockQueryService.getBlock$(this.blockId).subscribe(block => {
      if (block !== null) {

        // Now store the block to display
        this.block = block;
      }
    }, error => {
      const newError = new Error(`BlockComponent failed to get block: ${error.message}`);
      // TODO: Handle error in UI
      console.error(newError, this.blockId);
    });
  }

  toggleBlockOptions(status: boolean) {
    if (this.isSelectedOptionShown === false) {
      this.isBlockOptionsShown = status;
    }
  }

  toggleSelectedOptionStatus(event: boolean) {
    this.isSelectedOptionShown = event;
  }

  addBlock(type: BlockType) {
    this.createBlock.emit({
      type, id: this.blockId
    });
  }

  deleteTransmitter(blockId: string) {
    this.deleteEvent.emit(blockId);
  }
}
