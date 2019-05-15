import { BehaviorSubject } from 'rxjs';
import { UpdateBlockInput } from '../../../../../API';
import { InputBlock } from '../../../../classes/block/input-block';
import { CommandType } from '../../../../classes/command/commandType';
import { UpdateBlockCommand } from '../../../../classes/command/updateBlock/updateBlockCommand';
import { CommandService } from '../../../../services/command/command.service';

/**
 * Tasks needs to be handled by this class:
 * - manage any changes to the properties of the given input block
 * - let the child update backend for any changes by user
 * - update the child with any changes caused by another browser
 *
 */
export class InputBlockController {

  private inputBlock$: BehaviorSubject<InputBlock>;

  constructor(
    private commandService: CommandService
  ) {
    this.inputBlock$ = new BehaviorSubject(null);
  }

  setInputBlock(block: InputBlock) {
    this.inputBlock$.next(block);
  }

  getInputBlock$(): BehaviorSubject<InputBlock> {
    return this.inputBlock$;
  }

  async update({ answers = null, options = null, inputType = null }) {
    let command: UpdateBlockCommand;
    command = this.commandService.getCommand(CommandType.UPDATE_BLOCK) as UpdateBlockCommand;

    const input: UpdateBlockInput = {
      id: this.inputBlock$.value.id,
      type: this.inputBlock$.value.type
    };

    if (answers) { input.answers = this.cleanArray(answers); }
    if (options) { input.options = this.cleanArray(options); }
    if (inputType) { input.inputType = inputType; }

    await command.update(input);

  }

  private cleanArray(array: Array<string>) {
    return array.map(value => {
      return value === '' ? null : value;
    });
  }

}
