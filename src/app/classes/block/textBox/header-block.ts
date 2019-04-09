import { TextBlock, CreateAppTextBlockInput } from '../textBlock';
import { Block } from '../block';
import { TextBlockType } from 'src/API';

export type UUID = string;
export type ISOTimeString = string;
export type UserId = string;

export interface HeaderBlockInput {
    id: UUID;
    version: UUID;
    documentId: UUID;
    lastUpdatedBy: UserId;
    createdAt: ISOTimeString;
    updatedAt: ISOTimeString;
    value: string;
    textblocktype: TextBlockType; // TODO: @bruno register enum
}

export class HeaderBlock extends TextBlock implements Block {
    /**
     * This class inherit from TextBlock; No implementation 
     * change is required for parent block;
     */
    readonly textblocktype: TextBlockType;

    constructor(input: HeaderBlockInput) {
        super({
            id: input.id,
            version: input.version,
            documentId: input.documentId,
            lastUpdatedBy: input.lastUpdatedBy,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
            value: input.value, // register enum
        });

        this.textblocktype = input.textblocktype;
        this.validateTextblocktype();
    }

    private validateTextblocktype() {
        if (!Object.values(TextBlockType).includes(this.textblocktype)) {
            throw new Error('TextBlockType not supported');
        }
    }
}
