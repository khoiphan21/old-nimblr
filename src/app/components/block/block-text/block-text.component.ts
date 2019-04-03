import { Component, OnChanges, Input } from '@angular/core';
import { Block } from '../../../classes/block';
import { TextBlock } from "../../../classes/block/textBlock";
import { BlockCommandService } from '../../../services/block/command/block-command.service';
import { BlockFactoryService } from '../../../services/block/factory/block-factory.service';

@Component({
  selector: 'app-block-text',
  templateUrl: './block-text.component.html',
  styleUrls: ['./block-text.component.scss']
})
export class BlockTextComponent implements OnChanges {
  isPlaceholderShown: boolean;
  value: string;
  private timeout: any;

  // To control whether it's editable or not
  @Input() isUserLoggedIn: boolean;
  @Input() block: TextBlock;

  constructor(
    private blockCommandService: BlockCommandService,
    private factoryService: BlockFactoryService
  ) { }

  ngOnChanges() {
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
