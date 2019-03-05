import { Injectable } from '@angular/core';
import { Block, TextBlock, BlockCreateError } from '../../classes/block';
import { isUuid } from 'src/app/classes/helpers';
import { CreateBlockInput, CreateTextBlockInput, BlockType } from '../../../API';

const uuidv4 = require('uuid/v4');
@Injectable({
  providedIn: 'root'
})
export class BlockFactoryService {

  constructor() { }

  /**
   * Create a Block object from the given raw data. All parameters must not be
   * undefined or null. 'type', 'documentId' and 'lastUpdatedBy' must not be
   * undefined, but the other values will be automatically generated if not given
   *
   * @param param0 an object with options to create a block
   */
  createAppBlock({
    id = uuidv4(),
    type,
    version = uuidv4(),
    documentId,
    lastUpdatedBy,
    value = '',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
  }): Block {
    const input = {
      id, type, version, documentId, lastUpdatedBy,
      value, updatedAt, createdAt
    };

    ['id', 'type', 'version', 'documentId', 'lastUpdatedBy', 'createdAt',
      'updatedAt'
    ].forEach(paramName =>
      this.checkForNullOrUndefined(input[paramName], paramName)
    );

    ['id', 'version', 'documentId', 'lastUpdatedBy'].forEach(paramName => {
      this.checkIfUuid(input[paramName], paramName);
    });

    ['createdAt', 'updatedAt'].forEach(paramName => {
      this.checkIfValidTimeString(input[paramName], paramName);
    });

    switch (type) {
      case BlockType.TEXT:
        return new TextBlock(input);
      default:
        throw new BlockCreateError(null, 'BlockType not supported');
    }
  }

  private checkForNullOrUndefined(parameter, parameterName) {
    if (parameter === undefined) {
      throw new BlockCreateError(BlockType.TEXT, `BlockCreateError: ${parameterName} is missing`);
    } else if (parameter === null) {
      throw new BlockCreateError(BlockType.TEXT, `BlockCreateError: ${parameterName} cannot be null`);
    }
  }

  private checkIfUuid(parameter, parameterName) {
    if (!isUuid(parameter)) {
      const message = `BlockCreateError: ${parameterName} must be an uuid`;
      throw new BlockCreateError(BlockType.TEXT, message);
    }
  }

  private checkIfValidTimeString(parameter, parameterName) {
    const createdDate = new Date(parameter);
    if (`${createdDate}`.indexOf('Invalid Date') !== -1) {
      // console.log(`invalid date created: ${createdDate} for parameter: ${parameter}`);
      const message = `BlockCreateError: ${parameterName} must be a valid time string`;
      throw new BlockCreateError(BlockType.TEXT, message);
    }
  }
}
