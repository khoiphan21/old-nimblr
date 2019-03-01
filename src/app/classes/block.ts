export interface Block {
    readonly id: string;
    readonly version: string;
    readonly type: BlockType;
    readonly documentId: string;
    readonly lastUpdatedBy: string;
    readonly timestamp: number;
}

export enum BlockType {
    TEXT = 'TEXT',
    HEADER = 'HEADER',
    QUESTION = 'QUESTION'
}

export class TextBlock implements Block {
    readonly id: string;
    readonly version: string;
    readonly type: BlockType;
    readonly documentId: string;
    readonly lastUpdatedBy: string;
    readonly timestamp: number;
    readonly value: string;

    constructor(id: string, version: string, documentId: string, lastUpdatedBy: string, value: string = '') {
        this.id = id;
        this.version = version;
        this.documentId = documentId;
        this.type = BlockType.TEXT;
        this.lastUpdatedBy = lastUpdatedBy;
        this.timestamp = new Date().getTime();
        this.value = value;
    }
}

export class BlockCreateError extends Error {
    blockType: BlockType;
    constructor(blockType: BlockType, ...params) {
        super(...params);
        this.blockType = blockType;
    }
}

export interface BlockMutationOptions {
    newTextValue?: string;
}
