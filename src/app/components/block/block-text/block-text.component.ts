import { Component, OnChanges, Input, SimpleChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { Block } from '../../../classes/block/block';
import { TextBlock } from '../../../classes/block/textBlock';
import { BlockCommandService } from '../../../services/block/command/block-command.service';
import { BlockFactoryService } from '../../../services/block/factory/block-factory.service';
import { BlockType, TextBlockType } from 'src/API';
import { BlockQueryService } from 'src/app/services/block/query/block-query.service';
import { BlockTypeAndSubType } from '../createBlockEvent';

@Component({
  selector: 'app-block-text',
  templateUrl: './block-text.component.html',
  styleUrls: ['./block-text.component.scss']
})

export class BlockTextComponent implements OnInit, OnChanges {
  isPlaceholderShown: boolean;
  value: string;
  awaitKeyAction: Array<any>;

  private timeout: any;

  // To control whether it's editable or not
  @Input() isUserLoggedIn: boolean;
  @Input() block: TextBlock;
  @Input() focusBlockId: string;

  @Output() deleteEvent = new EventEmitter<string>();
  @Output() createBlock = new EventEmitter<BlockTypeAndSubType>();

  constructor(
    private blockCommandService: BlockCommandService,
    private factoryService: BlockFactoryService,
    private blockQueryService: BlockQueryService,
  ) { }

  ngOnInit() {
    this.setValue(this.block.value);
    this.awaitKeyAction = [];
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
          textBlockType: this.block.textBlockType
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

  onPaste(event: ClipboardEvent) {
    const pastedData = event.clipboardData.getData('Text');
    this.value += pastedData;
    this.setCaretToEnd();
    this.updateValue();
    event.preventDefault();
  }


  // TODO: @bruno refactor this seciton; its messy -> possibly into another file? / class?
  eventSelect(event: KeyboardEvent) {
    // Need to rename these functions **
    // the individual function will handle its own logic
    switch (event.key) {
      case 'Backspace':
        this.onBackSpaceAndEmptyTextbox(event);
        this.resetAwaitAction();
        break;

      case 'Enter':
        this.createTextBlockOnEnter(event);
        this.resetAwaitAction();
        break;

      case '-':
        this.waitForNextKey(event);
        break;

      case ' ':
        this.spacebarDetermineAction(event);
        this.resetAwaitAction();
        break;

      default:
        this.resetAwaitAction();
        break;
    }
  }

  private onBackSpaceAndEmptyTextbox(event: KeyboardEvent) {
    if (this.value === '') {
      // TODO: @bruno 1. structure it well, 2. upon bulletpoint deletion, it would convert back to normal textblock
      switch (this.block.type) {
        case BlockType.TEXT:
          this.textBlockBackspaceAction();
          break;

        default:
          this.deleteEvent.emit(this.block.id);
          break;
      }

      clearTimeout(this.timeout); // To prevent the last update call
      event.preventDefault();
    }
  }

  private textBlockBackspaceAction() {
    // TODO: @bruno test
    switch (this.block.textBlockType) {
      case TextBlockType.BULLET:
        this.convertToBlockType(TextBlockType.TEXT);
        break;

      default:
        this.deleteEvent.emit(this.block.id);
        break;
    }
  }

  private createTextBlockOnEnter(event: KeyboardEvent) {
    // TODO: @bruno test
    switch (this.block.textBlockType) {
      case TextBlockType.BULLET:
        this.createBlock.emit(
          { type: BlockType.TEXT, textBlockType: TextBlockType.BULLET }
        );
        break;
      default:
        this.createBlock.emit({ type: BlockType.TEXT });
        break;
    }
    event.preventDefault();
  }

  private waitForNextKey(event: KeyboardEvent) {
    // TODO:  @bruno not tested; awaitKeyAction new attribute
    if (this.value === '') {
      this.awaitKeyAction.push(event.key);
    } else { }
  }

  private spacebarDetermineAction(event: KeyboardEvent) {
    // TODO: @bruo not tested; double action await detection

    if (this.awaitKeyAction.length === 1 && this.awaitKeyAction[0] === '-') {
      this.createBulletPoint();
      event.preventDefault();
    } else { }

  }

  private createBulletPoint() {
    // TODO: @bruno not tested
    this.convertToBlockType(TextBlockType.BULLET);
    clearTimeout(this.timeout); // To prevent the last update call
  }

  private convertToBlockType(type: TextBlockType) {
    // TODO: @bruno not tested
    const textBlock = this.block as TextBlock;
    const updatedBlock: Block = this.factoryService.createAppBlock({
      id: textBlock.id,
      type: textBlock.type,
      documentId: textBlock.documentId,
      lastUpdatedBy: textBlock.lastUpdatedBy,
      value: textBlock.value,
      createdAt: textBlock.createdAt,
      textBlockType: type
    });

    // update the UI
    this.blockQueryService.updateBlockUI(updatedBlock);
    // update the backend
    return new Promise(resolve => {
      this.blockCommandService.updateBlock(updatedBlock).then(() => {
        resolve();
      });
    });
  }

  private resetAwaitAction() {
    this.awaitKeyAction = [];
  }

}
