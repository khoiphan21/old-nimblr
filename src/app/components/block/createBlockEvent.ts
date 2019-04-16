import { BlockType, TextBlockType } from 'src/API';
import { BlockId } from '../../classes/block/block';

export interface CreateBlockEvent {
  type: BlockType;
  id?: BlockId;
  textBlockType?: TextBlockType;
}
