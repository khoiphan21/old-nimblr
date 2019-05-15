import { Component, Output, EventEmitter, Input, OnChanges, OnInit } from '@angular/core';
import { fadeInOutAnimation } from '../../../animation';
import { BlockType, TextBlockType } from 'src/API';
import { CreateBlockEvent } from '../createBlockEvent';
import { BlockQueryService } from '../../../services/block/query/block-query.service';
import { Block } from 'src/app/classes/block/block';
import { BlockCommandService } from '../../../services/block/command/block-command.service';
import { TextBlock } from '../../../classes/block/textBlock';
import { BlockFactoryService } from '../../../services/block/factory/block-factory.service';

@Component({
  selector: 'app-block-option',
  templateUrl: './block-option.component.html',
  styleUrls: ['./block-option.component.scss'],
  animations: [fadeInOutAnimation]
})

export class BlockOptionComponent implements OnChanges, OnInit {
  showBlock = false;
  isConverterShown = false;
  block: Block;
  @Input() blockId: string;
  @Input() mouseFocusingBlock: string;
  @Input() isChildDoc: boolean;
  @Output() isSelectedOptionShown = new EventEmitter<boolean>();
  @Output() switchBlockOptionsOff = new EventEmitter<boolean>();

  @Output() createBlock = new EventEmitter<CreateBlockEvent>();
  @Output() deleteEvent = new EventEmitter<string>();

  // @Output() convertToBullet = new EventEmitter<BlockType>();
  // @Output() deleteBullet = new EventEmitter<BlockType>();

  isAddBlockContainerShown: boolean;
  isMenuSelectionContainerShown: boolean;


  constructor(
    private blockCommandService: BlockCommandService,
    private factoryService: BlockFactoryService,
    private blockQueryService: BlockQueryService
  ) { }

  ngOnChanges() {
    this.isAddBlockContainerShown = false;
    this.isMenuSelectionContainerShown = false;
    if (this.mouseFocusingBlock === this.blockId) {
      this.showBlock = true;
    } else {
      this.showBlock = false;
    }
  }

  ngOnInit() {
    this.blockQueryService.getBlock$(this.blockId).subscribe(block => {
      if (block !== null) {
        this.block = block;
      }
    }, error => {
      const newError = new Error(`BlockOption failed to get block: ${error.message}`);
      console.error(newError, this.blockId);
    });
  }

  showAddBlockContainer() {
    this.isAddBlockContainerShown = true;
    this.toggleSelectedOptionsStatus(true);
  }

  hideAddBlockContainer() {
    if (this.isAddBlockContainerShown === true) {
      this.isAddBlockContainerShown = false;
      this.toggleSelectedOptionsStatus(false);
      this.switchBlockOptionsOff.emit(false);
      this.isConverterShown = false;
    }
  }

  showMenuSelectionContainer() {
    this.isMenuSelectionContainerShown = true;
    this.toggleSelectedOptionsStatus(true);
  }

  hideMenuSelectionContainer() {
    if (this.isMenuSelectionContainerShown === true) {
      this.isMenuSelectionContainerShown = false;
      this.toggleSelectedOptionsStatus(false);
      this.switchBlockOptionsOff.emit(false);
      this.isConverterShown = false;
    }
  }

  private toggleSelectedOptionsStatus(status: boolean) {
    this.isSelectedOptionShown.emit(status);
  }

  addTextBlock() {
    const input: CreateBlockEvent = {
      type: BlockType.TEXT,
      id: this.blockId
    };
    this.createBlock.emit(input);
    this.hideAddBlockContainer();
  }

  addInputBlock() {
    const input: CreateBlockEvent = {
      type: BlockType.INPUT,
      id: this.blockId
    };
    this.createBlock.emit(input);
    this.hideAddBlockContainer();
  }

  addHeaderBlock() {
    const input: CreateBlockEvent = {
      type: BlockType.TEXT,
      id: this.blockId,
      textBlockType: TextBlockType.HEADER
    };
    this.createBlock.emit(input);
    this.hideAddBlockContainer();
  }

  addBulletBlock() {
    // TODO: @bruo not impl
    const input: CreateBlockEvent = {
      type: BlockType.TEXT,
      id: this.blockId,
      textBlockType: TextBlockType.BULLET
    };
    this.createBlock.emit(input);
    this.hideAddBlockContainer();
  }

  deleteHandler() {
    this.toggleSelectedOptionsStatus(false);
    this.deleteEvent.emit(this.blockId);
  }

  convertBlockInto(type: TextBlockType) {
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
    this.hideMenuSelectionContainer();
    // update the UI
    this.blockQueryService.updateBlockUI(updatedBlock);
    // update the backend
    return new Promise(resolve => {
      this.blockCommandService.updateBlockLegacy(updatedBlock).then(() => {
        resolve();
      });
    });
  }


}
