import { Component, OnChanges, Input, ChangeDetectorRef, SimpleChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { Block } from '../../../classes/block/block';
import { TextBlock } from '../../../classes/block/textBlock';
import { BlockCommandService } from '../../../services/block/command/block-command.service';
import { BlockFactoryService } from '../../../services/block/factory/block-factory.service';
import { TextBlockType } from 'src/API';

@Component({
  selector: 'app-block-text',
  templateUrl: './block-text.component.html',
  styleUrls: ['./block-text.component.scss']
})
export class BlockTextComponent implements OnInit, OnChanges {
  isPlaceholderShown: boolean;
  value: string;
  private timeout: any;

  // To control whether it's editable or not
  @Input() isUserLoggedIn: boolean;
  @Input() block: TextBlock;
  @Input() focusBlockId: string;

  @Output() deleteEvent = new EventEmitter<string>();

  constructor(
    private blockCommandService: BlockCommandService,
    private factoryService: BlockFactoryService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.setValue(this.block.value);
  }

  private setValue(value: string) {
    this.value = value ? value : '';
  }

  ngOnChanges(changes: SimpleChanges) {
    // NOTE: call this AFTER setting all values first due to the call to
    // detectChanges()
    const focus = changes.focusBlockId;
    if (focus) {
      if (!focus.currentValue) { return; }

      if (focus.currentValue.includes(this.block.id)) {
        // NOTE: THIS COULD AFFECT CODE IN OTHER LIFECYCLE HOOKS
        this.changeDetector.detectChanges();
        const element = document.getElementById(this.block.id);
        element.focus();
        // TODO @jeremyng Move caret to the end

      }
    } else if (changes.block) {
      const newBlock = changes.block.currentValue;
      this.setValue(newBlock.value);
    }
  }

  async updateValue(textblocktype: TextBlockType): Promise<Block> {
    // Show place holder if value becomes ''
    this.isPlaceholderShown = true;

    return new Promise(resolve => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        const updatedBlock: Block = this.factoryService.createAppBlock({
          id: this.block.id,
          type: this.block.type,
          documentId: this.block.documentId,
          lastUpdatedBy: this.block.lastUpdatedBy,
          value: this.value,
          createdAt: this.block.createdAt,
          textblocktype,
        });
        this.blockCommandService.updateBlock(updatedBlock).then(() => {
          resolve(updatedBlock);
        });
      }, 500);
    });
  }

  togglePlaceholder(status: boolean) {
    this.isPlaceholderShown = status;
  }

  onBackSpaceAndEmptyTextbox() {
    if (this.value === '') {
      this.deleteEvent.emit(this.block.id);
    }
  }

}
