import { Block, BlockImpl, BlockId } from './block';
import { BlockType, TextBlockType } from 'src/API';
import { UUID, ISOTimeString } from 'src/app/services/document/command/document-command.service';
import { UserId } from '../user';

const uuidv4 = require('uuid/v4');

export interface CreateAppTextBlockInput {
  id: UUID;
  version: UUID;
  documentId: UUID;
  lastUpdatedBy: UserId;
  createdAt: ISOTimeString;
  updatedAt: ISOTimeString;
  value: string;
  textblocktype?: TextBlockType;
}
/**
 * A simple block type that contains a string value
 */
export class TextBlock extends BlockImpl implements Block {
  readonly value: string;
  readonly textblocktype: TextBlockType;

  constructor(input: CreateAppTextBlockInput) {
    super({
      type: BlockType.TEXT,
      documentId: input.documentId,
      lastUpdatedBy: input.lastUpdatedBy,
      id: input.id,
      version: input.version,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });

    this.value = input.value ? input.value : '';
    this.textblocktype = input.textblocktype ? input.textblocktype : TextBlockType.TEXT;
  }
}
