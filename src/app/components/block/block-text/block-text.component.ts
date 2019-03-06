import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Block, TextBlock } from '../../../classes/block';
import { BlockCommandService } from '../../../services/block/block-command.service';
import { BlockFactoryService } from '../../../services/block/block-factory.service';
import { UpdateTextBlockInput } from '../../../../API';

@Component({
  selector: 'app-block-text',
  templateUrl: './block-text.component.html',
  styleUrls: ['./block-text.component.scss']
})
export class BlockTextComponent implements OnChanges {

  value: string;
  private timeout: any;

  @Input() block: TextBlock;

  constructor(
    private blockCommandService: BlockCommandService,
    private factoryService: BlockFactoryService
  ) { }

  ngOnChanges() {
    this.value = this.block.value === null ? '' : this.block.value;
  }

  updateValue() {
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
      this.blockCommandService.updateBlock(updatedBlock);
    }, 500);
  }


}
