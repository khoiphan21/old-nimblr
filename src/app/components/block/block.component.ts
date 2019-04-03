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

  block: Block;

  @Input() blockId: string;
  @Input() isUserLoggedIn: boolean;

  @Output() createBlock = new EventEmitter<CreateBlockEvent>();

  constructor(
    private blockQueryService: BlockQueryService
  ) { }

  ngOnInit() {
    this.blockQueryService.getBlock$(this.blockId).subscribe(block => {
      if (block !== null) {
        this.block = block;
      }
    }, error => {
      const newError = new Error(`BlockComponent failed to get block: ${error.message}`);
      // TODO: Handle error in UI
      console.error(newError);
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

}
