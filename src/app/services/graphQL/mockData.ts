import { Block } from '../../classes/block';
import { BlockType } from '../../../API';
const uuidv4 = require('uuid/v4');

export class MockAPIDataFactory {
    static createBlock({
        queryName,
        id = uuidv4(),
        version = uuidv4(),
        type = BlockType.TEXT,
        documentId = uuidv4(),
        lastUpdatedBy = uuidv4(),
        updatedAt = new Date().toISOString(),
        createdAt = new Date().toISOString()
    }): any {
        const returnData: any = {};
        returnData.data = {};
        returnData.data[queryName] = {
            id, version, type, documentId, lastUpdatedBy, updatedAt, createdAt
        };
        return returnData;
    }
}
