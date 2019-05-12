import { Component, Input, OnChanges, ChangeDetectorRef, SimpleChanges, OnInit } from '@angular/core';
import { InputType } from 'src/API';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';
import { BlockCommandService } from 'src/app/services/block/command/block-command.service';
import { Block } from 'src/app/classes/block/block';
import { InputBlock } from '../../../classes/block/input-block';
import { UpdateInputBlockInput } from '../../../../API';

@Component({
  selector: 'app-input-block',
  templateUrl: './input-block.component.html',
  styleUrls: ['./input-block.component.scss']
})
export class InputBlockComponent implements OnInit, OnChanges {
  // TODO IMPLEMENT CONTROL OF WHETHER IT'S DEITABLE OR NOT
  // To control whether it's editable or not
  @Input() isEditable: boolean;
  @Input() inputBlock: InputBlock;
  @Input() focusBlockId: string;

  valueUpdated = true;
  isPreviewMode = true;
  isInputOptionShown = false;
  answers = [];
  options = [];
  currentType: InputType;
  isInputLocked: boolean;
  protected timeout: any;

  constructor(
    private blockFactoryService: BlockFactoryService,
    private blockCommandService: BlockCommandService
  ) { }

  ngOnInit(): void {
    this.setInputValues();
  }

  private setInputValues() {
    this.answers = this.inputBlock.answers;
    this.options = this.inputBlock.options;
    this.isInputLocked = this.inputBlock.isLocked;
    this.currentType = this.inputBlock.inputType;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.inputBlock) {
      this.setInputValues();
    }
  }

  toggleOptions() {
    this.isInputOptionShown = this.isInputOptionShown ? false : true;
  }

  selectType(type: InputType, event: Event) {
    this.currentType = type;
    this.toggleOptions();
    this.isPreviewMode = false;
    event.stopImmediatePropagation();
  }

  async changeLockStatus() {
    this.isInputLocked = !this.isInputLocked;

    this.updateBlock({
      id: this.inputBlock.id,
      type: this.inputBlock.type,
      version: 'temp',
      lastUpdatedBy: this.inputBlock.lastUpdatedBy,
      isLocked: this.isInputLocked
    });
  }

  updateInputValue(event: any) {
    const updatedBlock: Block = this.blockFactoryService.createAppBlock({
      id: this.inputBlock.id,
      type: this.inputBlock.type,
      documentId: this.inputBlock.documentId,
      lastUpdatedBy: this.inputBlock.lastUpdatedBy,
      createdAt: this.inputBlock.createdAt,
      answers: event.answers,
      inputType: this.currentType,
      options: event.options,
      isLocked: this.isInputLocked
    });
    this.updateBlock(updatedBlock);
  }

  updateBlock(params: UpdateInputBlockInput) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      // this.valueUpdated = false;
      await this.blockCommandService.updateBlock(params);
      // this.valueUpdated = true;
    }, 500);
  }
}
