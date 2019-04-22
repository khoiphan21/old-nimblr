import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { fadeInOutAnimation } from '../../../animation';
import { BlockType, TextBlockType } from 'src/API';
import { CreateBlockEvent } from '../createBlockEvent';

@Component({
  selector: 'app-block-option',
  templateUrl: './block-option.component.html',
  styleUrls: ['./block-option.component.scss'],
  animations: [fadeInOutAnimation]
})

export class BlockOptionComponent implements OnChanges {
  showBlock = false;
  isConverterShown = false;
  @Input() blockId: string;
  @Input() mouseFocusingBlock: string;
  @Input() isChildDoc: boolean;
  @Output() isSelectedOptionShown = new EventEmitter<boolean>();
  @Output() switchBlockOptionsOff = new EventEmitter<boolean>();
  @Output() createBlock = new EventEmitter<CreateBlockEvent>();

  isAddBlockContainerShown: boolean;
  isMenuSelectionContainerShown: boolean;

  @Output() deleteEvent = new EventEmitter<string>();

  constructor() { }

  ngOnChanges() {
    this.isAddBlockContainerShown = false;
    this.isMenuSelectionContainerShown = false;
    if (this.mouseFocusingBlock === this.blockId) {
      this.showBlock = true;
    } else {
      this.showBlock = false;
    }
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

  addQuestionBlock() {
    const input: CreateBlockEvent = {
      type: BlockType.QUESTION,
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

  deleteHandler() {
    this.toggleSelectedOptionsStatus(false);
    this.deleteEvent.emit(this.blockId);
  }

}
