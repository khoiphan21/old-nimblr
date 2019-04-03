import { Block, BlockImpl } from './block';
import { BlockType } from 'src/API';

/**
 * A simple block type that contains a string value
 */
export class TextBlock extends BlockImpl implements Block {
  readonly value: string;

  constructor({
    id,
    version,
    documentId,
    lastUpdatedBy,
    updatedAt,
    createdAt,
    value
  }) {
    super({
      id,
      type: BlockType.TEXT,
      version,
      documentId,
      lastUpdatedBy,
      updatedAt,
      createdAt,
    });

    this.value = value ? value : '';
  }
}
