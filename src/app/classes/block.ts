
const uuidv5 = require('uuid/v5');

export interface Block {
    readonly id: string;
    readonly version: string;
    readonly type: BlockType;
    readonly documentId: string;
    readonly lastUpdatedBy: string;
    readonly createdAt: string;
    readonly updatedAt: string;
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
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly value: string;

    constructor({
        version,
        documentId,
        id = uuidv5(version, documentId),
        lastUpdatedBy,
        value = '',
        updatedAt = new Date().toISOString(),
        createdAt = new Date().toISOString()
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
        super(...params);
        this.blockType = blockType;
    }
}
