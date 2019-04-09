import { TextBlock, CreateAppTextBlockInput } from '../textBlock';
import { Block } from '../block';

export interface CreateAppHeaderBlockInput {

}


export class HeaderBlock extends TextBlock implements Block {
    /**
     * This class inherit from TextBlock; No implementation 
     * change is required for parent block;
     */

    constructor() { }
}
