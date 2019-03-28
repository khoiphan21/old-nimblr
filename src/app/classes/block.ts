import { BlockType } from 'src/API';
import { UUID, ISOTimeString } from '../services/document/command/document-command.service';

export interface Block {
  readonly id: UUID;
  readonly version: UUID;
  readonly type: BlockType;
  readonly documentId: UUID;
  readonly lastUpdatedBy: UUID;
  readonly createdAt: ISOTimeString;
  readonly updatedAt: ISOTimeString;
}

export class TextBlock implements Block {
  readonly id: UUID;
  readonly version: UUID;
  readonly type: BlockType;
  readonly documentId: UUID;
  readonly lastUpdatedBy: UUID;
  readonly createdAt: ISOTimeString;
  readonly updatedAt: ISOTimeString;
  readonly value: string;

  constructor({
    id,
    version,
    documentId,
    lastUpdatedBy,
    value,
    updatedAt,
    createdAt
  }) {
    this.id = id;
    this.version = version;
    this.documentId = documentId;
    this.type = BlockType.TEXT;
    this.lastUpdatedBy = lastUpdatedBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.value = value;
  }
}

export class BlockCreateError extends Error {
  blockType: BlockType;
  constructor(blockType: BlockType, ...params) {
    /* istanbul ignore next */
    super(...params);
    this.blockType = blockType;
  }
}
