import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { fadeInOutAnimation } from '../../../animation';
import { BlockType } from 'src/API';
import { Block } from 'src/app/classes/block/block';
import { CreateBlockEvent } from '../block.component';

@Component({
  selector: 'app-block-option',
  templateUrl: './block-option.component.html',
  styleUrls: ['./block-option.component.scss'],
  animations: [fadeInOutAnimation]
})
export class BlockOptionComponent implements OnChanges {
  showBlock = false;
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
    }
  }

  private toggleSelectedOptionsStatus(status: boolean) {
    this.isSelectedOptionShown.emit(status);
  }

  addTextBlock() {
    const type = BlockType.TEXT;
    this.createBlock.emit({
      type, id: this.blockId
    });
    this.hideAddBlockContainer();
  }

  addQuestionBlock() {
    const type = BlockType.QUESTION;
    this.createBlock.emit({
      type, id: this.blockId
    });
    this.hideAddBlockContainer();
  }

  deleteHandler() {
    this.toggleSelectedOptionsStatus(false);
    this.deleteEvent.emit(this.blockId);
  }

}
