import {
  Component,
  OnChanges,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { Block } from '../../../classes/block/block';
import { TextBlock } from '../../../classes/block/textBlock';
import { BlockCommandService } from '../../../services/block/command/block-command.service';
import { BlockFactoryService } from '../../../services/block/factory/block-factory.service';
import { BlockType } from 'src/API';

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
  @Output() createBlock = new EventEmitter<BlockType>();

  constructor(
    private blockCommandService: BlockCommandService,
    private factoryService: BlockFactoryService
  ) { }

  ngOnInit() {
    this.setValue(this.block.value);
  }

  private setValue(value: string) {
    this.value = value ? value : '';
  }

  async ngOnChanges(changes: SimpleChanges) {
    const focus = changes.focusBlockId;

    if (focus) {
      if (!focus.currentValue) {
        return;
      }
      if (focus.currentValue.includes(this.block.id)) {
        await this.setCaretToEnd();
      }
    } else if (changes.block) {
      const newBlock = changes.block.currentValue;
      this.setValue(newBlock.value);
    }
  }

  async setCaretToEnd() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const element = document.getElementById(this.block.id);
          element.focus();
          if (this.value) {
            window.getSelection().setPosition(element, 1);
          } else {
            window.getSelection().setPosition(element, 0);
          }
          resolve();

        } catch (error) {
          reject(Error('Failed to set caret: element does not exist'));
        }
      });
    });
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
          createdAt: this.block.createdAt,
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

  onBackSpaceAndEmptyTextbox(event: Event) {
    if (this.value === '') {
      this.deleteEvent.emit(this.block.id);
      clearTimeout(this.timeout); // To prevent the last update call
      event.preventDefault();
    }
  }

  createTextBlockOnEnter(event: Event) {
    this.createBlock.emit(BlockType.TEXT);
    event.preventDefault();
  }

  onPaste(event: ClipboardEvent) {
    const pastedData = event.clipboardData.getData('Text');
    this.value += pastedData;
    this.setCaretToEnd();
    this.updateValue();
    event.preventDefault();
  }
}
