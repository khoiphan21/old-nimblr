import { Component, OnChanges, Input, ChangeDetectorRef, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Block } from '../../../classes/block/block';
import { TextBlock } from '../../../classes/block/textBlock';
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
  @Input() focusBlockId: string;

  @Output() deleteEvent = new EventEmitter<string>();

  constructor(
    private blockCommandService: BlockCommandService,
    private factoryService: BlockFactoryService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    this.value = this.block.value;

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
    }
  }

  async updateValue(): Promise<Block> {
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

  onBackSpaceAndEmptyTextbox() {
    if (this.value === '') {
      this.deleteEvent.emit(this.block.id);
    }
  }

}
