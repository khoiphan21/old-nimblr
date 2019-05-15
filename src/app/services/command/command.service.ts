import { Injectable } from '@angular/core';
import { BlockCommandService } from '../block/command/block-command.service';
import { UUID, DocumentCommandService } from '../document/command/document-command.service';
import { CommandType } from '../../classes/command/commandType';
import { Command } from '../../classes/command/command';
import { AccountService } from '../account/account.service';
import { BlockQueryService } from '../block/query/block-query.service';
import { DocumentQueryService } from '../document/query/document-query.service';
import { DocumentFactoryService } from '../document/factory/document-factory.service';
import { EmailService } from '../email/email.service';
import { SendDocumentCommand } from 'src/app/classes/command/sendDocument/sendDocumentCommand';
import { UpdateBlockCommand } from 'src/app/classes/command/updateBlock/updateBlockCommand';
import { VersionService } from '../version/version.service';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  private commandMap: Map<CommandType, Command>;

  constructor(
    private accountService: AccountService,
    private blockCommandService: BlockCommandService,
    private blockQueryService: BlockQueryService,
    private documentCommandService: DocumentCommandService,
    private documentQueryService: DocumentQueryService,
    private documentFactoryService: DocumentFactoryService,
    private emailService: EmailService,
    private versionService: VersionService
  ) {
    this.commandMap = new Map();
  }

  getCommand(command: CommandType): Command {
    if (!this.commandMap.has(command)) {
      this.createCommand(command);
    }
    return this.commandMap.get(command);
  }

  private createCommand(type: CommandType) {
    let command: Command;

    switch (type) {
      case CommandType.SEND_DOCUMENT:
        command = new SendDocumentCommand({
          accountService: this.accountService,
          blockCommandService: this.blockCommandService,
          blockQueryService: this.blockQueryService,
          documentCommandService: this.documentCommandService,
          documentQueryService: this.documentQueryService,
          documentFactoryService: this.documentFactoryService,
          emailService: this.emailService,
        });
        break;

      case CommandType.UPDATE_BLOCK:
        command = new UpdateBlockCommand({
          blockCommandService: this.blockCommandService,
          accountService: this.accountService,
          versionService: this.versionService
        });
        break;
      default:
        const message = 'CommandService failed to getCommand: unknown CommandType';
        throw new Error(message);
    }

    this.commandMap.set(type, command);
  }

}
