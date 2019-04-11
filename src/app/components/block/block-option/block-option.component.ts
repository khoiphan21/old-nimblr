import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { fadeInOutAnimation } from '../../../animation';
import { BlockType } from 'src/API';
import { Block } from 'src/app/classes/block/block';

@Component({
  selector: 'app-block-option',
  templateUrl: './block-option.component.html',
  styleUrls: ['./block-option.component.scss'],
  animations: [fadeInOutAnimation]
})
export class BlockOptionComponent implements OnChanges {

  @Input() isBlockOptionsShown: boolean;
  @Input() isChildDoc: boolean;
  @Output() isSelectedOptionShown = new EventEmitter<boolean>();
  @Output() switchBlockOptionsOff = new EventEmitter<boolean>();
  @Output() createBlock = new EventEmitter<BlockType>();

  isAddBlockContainerShown: boolean;
  isMenuSelectionContainerShown: boolean;

  @Output() deleteEvent = new EventEmitter<string>();
  @Input() block: Block;

  constructor() { }

  ngOnChanges() {
    this.isAddBlockContainerShown = false;
    this.isMenuSelectionContainerShown = false;
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
    this.createBlock.emit(BlockType.TEXT);
    this.hideAddBlockContainer();
  }

  addQuestionBlock() {
    this.createBlock.emit(BlockType.QUESTION);
    this.hideAddBlockContainer();
  }

  deleteHandler() {
    this.deleteEvent.emit(this.block.id);
  }

}
