import { TextBlock, CreateAppTextBlockInput } from '../textBlock';
import { Block } from '../block';
import { TextBlockType } from 'src/API';

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
            value: input.value,
            textBlockType: TextBlockType.HEADER
        });

    }
}
