import { BlockCommandService, UpdateBlockServiceInput } from '../../../services/block/command/block-command.service';
import { UpdateBlockInput, BlockType } from '../../../../API';
import { uuidv4 } from '../../uuidv4';
import { AccountService } from '../../../services/account/account.service';
import { VersionService } from '../../../services/version/version.service';
import { User } from '../../user';

export interface UpdateBlockCommandDependencies {
  blockCommandService: BlockCommandService;
  accountService: AccountService;
  versionService: VersionService;
}

/**
 * Handle the specifics around updating a block
 */
export class UpdateBlockCommand {
  private blockCommandService: BlockCommandService;
  private accountService: AccountService;
  private versionService: VersionService;


  constructor(input: UpdateBlockCommandDependencies) {
    this.blockCommandService = input.blockCommandService;
    this.accountService = input.accountService;
    this.versionService = input.versionService;
  }

  /**
   * Update a block with the given ID to the new given values. Only pass in
   * values that *must* be updated. Some values will be auto-generated or
   * auto-retrieved if not given, such as `version`, `lastUpdatedBy` and `updatedAt`.
   *
   * The version will be registered with the `VersionService` as this is created
   * by this app instance to prevent false updates.
   *
   * @param input the values of the block to be updated.
   */
  async update(givenInput: UpdateBlockInput) {
    const input: UpdateBlockServiceInput = this.extract(givenInput);

    input.version = input.version ? input.version : uuidv4();

    const currentUser: User = await this.accountService.isUserReady();
    input.lastUpdatedBy = input.lastUpdatedBy ? input.lastUpdatedBy : currentUser.id;

    input.updatedAt = input.updatedAt ? input.updatedAt : new Date().toISOString();

    this.versionService.registerVersion(input.version);

    await this.blockCommandService.updateBlock(input);
  }

  /**
   * Extract the required parameters from the input into a mutable object.
   * This is necessary to ensure that whole blocks can be used as arguments
   *
   * @param input The raw input to extract from
   */
  private extract(input: UpdateBlockInput): UpdateBlockServiceInput {
    const {
      id, version, type, documentId, lastUpdatedBy, updatedAt,
      value, textBlockType, answers, inputType, options, isLocked
    } = input;

    switch (input.type) {
      case BlockType.TEXT:
        return {
          id, version, type, documentId, lastUpdatedBy, updatedAt, value, textBlockType
        };

      case BlockType.INPUT:
        return {
          id, version, type, documentId, lastUpdatedBy, updatedAt, value,
          answers, inputType, options, isLocked
        };

      default:
        throw new Error(`UpdateBlockCommand faild: BlockType ${input.type} not supported`);
    }
  }
}
