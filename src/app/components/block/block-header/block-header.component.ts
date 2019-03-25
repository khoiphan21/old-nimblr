import { Component, OnInit } from '@angular/core';
import { Block, TextBlock } from '../../../classes/block';
import { BlockCommandService } from '../../../services/block/command/block-command.service';
import { BlockFactoryService } from '../../../services/block/factory/block-factory.service';

@Component({
  selector: 'app-block-header',
  templateUrl: './block-header.component.html',
  styleUrls: ['./block-header.component.scss']
})
export class BlockHeaderComponent implements OnInit {

  block: any;

  isPlaceholderShown: boolean;
  value: string;
  private timeout: any;

  constructor(
    private blockCommandService: BlockCommandService,
    private factoryService: BlockFactoryService
  ) { }

  ngOnInit() {
    this.value = this.block.value === null ? '' : this.block.value;
  }

  async updateValue(): Promise<Block> {
    return new Promise(resolve => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        const updatedBlock: Block = this.factoryService.createAppBlock({
          id: this.block.id,
          type: this.block.type,
          documentId: this.block.documentId,
          lastUpdatedBy: this.block.lastUpdatedBy,
          value: this.value,
          createdAt: this.block.createdAt
        });
        this.blockCommandService.updateBlock(updatedBlock).then(() => {
          resolve(updatedBlock);
        });
      }, 500);
    });
  }

  togglePlaceholder(status: boolean) {
    if (this.value.length > 0 || status === false) {
      this.isPlaceholderShown = false;
    } else {
      this.isPlaceholderShown = true;
    }
  }

}
