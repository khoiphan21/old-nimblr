import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InputType } from 'src/API';
import { InputBlock } from '../../../classes/block/input-block';
import { CommandType } from '../../../classes/command/commandType';
import { UpdateBlockCommand } from '../../../classes/command/updateBlock/updateBlockCommand';
import { CommandService } from '../../../services/command/command.service';
import { InputBlockController } from './controller/input-block-controller';

@Component({
  selector: 'app-input-block',
  templateUrl: './input-block.component.html',
  styleUrls: ['./input-block.component.scss']
})
export class InputBlockComponent implements OnChanges {
  // TODO IMPLEMENT CONTROL OF WHETHER IT'S EDITABLE OR NOT
  // To control whether it's editable or not
  @Input() isEditable: boolean;
  @Input() inputBlock: InputBlock;
  @Input() focusBlockId: string;

  controller: InputBlockController;

  isPreviewMode = true;
  isInputOptionShown = false;
  currentType: InputType;
  isLocked: boolean;
  protected timeout: any;

  constructor(
    private commandService: CommandService
  ) {
    this.controller = new InputBlockController(this.commandService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.inputBlock) {
      const block = changes.inputBlock.currentValue as InputBlock;

      this.controller.setInputBlock(block);
      this.isLocked = block.isLocked;
      this.currentType = block.inputType;
    }
  }

  selectType(type: InputType, event: Event) {
    this.currentType = type;
    this.toggleOptions();
    this.isPreviewMode = false;
    event.stopImmediatePropagation();
  }

  toggleOptions() {
    this.isInputOptionShown = this.isInputOptionShown ? false : true;
  }

  async changeLockStatus() {
    this.isLocked = !this.isLocked;

    let command: UpdateBlockCommand;
    command = this.commandService.getCommand(CommandType.UPDATE_BLOCK) as UpdateBlockCommand;
    await command.update({
      id: this.inputBlock.id,
      type: this.inputBlock.type,
      isLocked: this.isLocked
    });
  }

}
