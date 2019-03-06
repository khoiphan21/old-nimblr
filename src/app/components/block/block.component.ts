import { Component, OnInit, Input } from '@angular/core';
import { Block } from '../../classes/block';
import { BlockQueryService } from '../../services/block/block-query.service';

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

  constructor(
    private blockQueryService: BlockQueryService
  ) { }

  ngOnInit() {
    this.blockQueryService.getBlock$(this.blockId).subscribe(block => {
      if (block !== null) {
        console.log('block notification: ', block);
        this.block = block;
      }
    }, error => {
      console.error(`BlockComponent unable to get block: ${this.blockId}. Details below`);
      console.error(error);
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

}
