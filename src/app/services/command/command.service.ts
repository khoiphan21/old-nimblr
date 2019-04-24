import { Injectable } from '@angular/core';
import { BlockCommandService } from '../block/command/block-command.service';
import { UUID } from '../document/command/document-command.service';
import { CommandType } from '../../classes/command/commandType';
import { Command } from '../../classes/command/command';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  constructor(
    private blockCommandService: BlockCommandService
  ) { }

  getCommand(command: CommandType): Command {
    return;
  }

}
