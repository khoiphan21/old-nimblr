export enum BlockType {
    TEXT,
    HEADER,
    QUESTION
}

export interface BlockUpdateOptions {
    newTextValue?: string;
}
