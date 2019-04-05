import { Block, BlockImpl, BlockId } from './block';
import { BlockType } from 'src/API';
import { UUID, ISOTimeString } from 'src/app/services/document/command/document-command.service';
import { UserId } from '../user';

export interface CreateAppTextBlockInput {
  id: BlockId;
  version: UUID;
  documentId: UUID;
  lastUpdatedBy: UserId;
  createdAt: ISOTimeString;
  updatedAt: ISOTimeString;
  value: string;
}
/**
 * A simple block type that contains a string value
 */
export class TextBlock extends BlockImpl implements Block {
  readonly value: string;

  constructor(input: CreateAppTextBlockInput) {
    super({
      id: input.id,
      type: BlockType.TEXT,
      version: input.version,
      documentId: input.documentId,
      lastUpdatedBy: input.lastUpdatedBy,
      updatedAt: input.updatedAt,
      createdAt: input.createdAt,
    });

    this.value = input.value ? input.value : '';
  }
}
