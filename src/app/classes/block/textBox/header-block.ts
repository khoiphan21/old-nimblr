import { TextBlock, CreateAppTextBlockInput } from '../textBlock';
import { Block } from '../block';
import { TextBlockType } from 'src/API';

export type UUID = string;
export type ISOTimeString = string;
export type UserId = string;

const uuidv4 = require('uuid/v4');

export class HeaderBlock extends TextBlock implements Block {
    /**
     * This class inherit from TextBlock; No implementation 
     * change is required for parent block;
     */

    constructor(input: CreateAppTextBlockInput) {
        super({
            id: input.id,
            version: input.version,
            documentId: input.documentId,
            lastUpdatedBy: input.lastUpdatedBy,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
            value: input.value, // register enum
            textBlockType: input.textBlockType,
        });

        this.validateTextblocktype();
    }

    private validateTextblocktype() {
        // validation will only be done in this block
        const isRegisteredTextBlockType = Object.values(TextBlockType).includes(this.textBlockType);
        const isNotNull = this.textBlockType !== null;
        if (isRegisteredTextBlockType && isNotNull) { } else {
            throw new Error('TextBlockType not supported');
        };
    }
}
