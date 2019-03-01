import { Injectable } from '@angular/core';
import { Block, BlockType, TextBlock, BlockCreateError } from '../../classes/block';
import { isUuid } from 'src/app/classes/helpers';

const uuidv5 = require('uuid/v5');

@Injectable({
  providedIn: 'root'
})
export class BlockFactoryService {

  constructor() { }

  createBlock(data): Block {
    this.checkParameter(data.version, 'version');
    this.checkParameter(data.documentId, 'documentId');
    this.checkParameter(data.lastUpdatedBy, 'lastUpdatedBy');

    switch (data.type) {
      case BlockType.TEXT:
        this.checkParameter(data.value, 'value', false);
        return this.createTextBlock(data);
      default:
        throw new BlockCreateError(null, 'BlockType not supported');
    }
  }

  private checkParameter(parameter, parameterName, shouldCheckUuid = true) {
    if (parameter === undefined) {
      throw new BlockCreateError(BlockType.TEXT, `BlockCreateError: ${parameterName} is missing`);
    } else if (parameter === null) {
      throw new BlockCreateError(BlockType.TEXT, `BlockCreateError: ${parameterName} cannot be null`);
    }
    if (shouldCheckUuid) {
      this.checkIfUuid(parameter, parameterName);
    }
  }

  private checkIfUuid(parameter, parameterName) {
    if (!isUuid(parameter)) {
      throw new BlockCreateError(BlockType.TEXT, `BlockCreateError: ${parameterName} must be an uuid`);
    }
  }

  private createTextBlock({
    version, documentId, lastUpdatedBy, value, id = uuidv5(version, documentId)
  }) {
    return new TextBlock(id, version, documentId, lastUpdatedBy, value);

  }
}
