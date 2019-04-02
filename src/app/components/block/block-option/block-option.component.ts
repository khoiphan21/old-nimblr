import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { fadeInOutAnimation } from '../../../animation';
import { Block } from 'src/app/classes/block';
import { BlockCommandService } from 'src/app/services/block/command/block-command.service';

import { DeleteBlockInput } from '../../../../API';
import { DocumentPageComponent } from 'src/app/pages/document-page/document-page.component';

@Component({
  selector: 'app-block-option',
  templateUrl: './block-option.component.html',
  styleUrls: ['./block-option.component.scss'],
  animations: [fadeInOutAnimation]
})
export class BlockOptionComponent implements OnChanges {

  @Input() isBlockOptionsShown: boolean;
  @Output() isSelectedOptionShown = new EventEmitter<boolean>();
  @Output() switchBlockOptionsOff = new EventEmitter<boolean>();
  isAddBlockContainerShown: boolean;
  isMenuSelectionContainerShown: boolean;

  
  @Input() block: Block;

  constructor( ) { }

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

}
