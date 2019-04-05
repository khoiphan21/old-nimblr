import { BlockType } from 'src/API';
import { UUID, ISOTimeString } from '../../services/document/command/document-command.service';
import { isValidDateString } from '../isValidDateString';
import { isUuid } from '../helpers';

export type BlockId = UUID;

export interface Block {
  readonly id: BlockId;
  readonly version: UUID;
  readonly type: BlockType;
  readonly documentId: UUID;
  readonly lastUpdatedBy: UUID;
  readonly createdAt: ISOTimeString;
  readonly updatedAt: ISOTimeString;
}

export class BlockImpl implements Block {
  private baseErrorMessage: string;

  readonly id: BlockId;
  readonly version: UUID;
  readonly type: BlockType;
  readonly documentId: UUID;
  readonly lastUpdatedBy: UUID;
  readonly createdAt: ISOTimeString;
  readonly updatedAt: ISOTimeString;

  constructor({
    id,
    version,
    type,
    documentId,
    lastUpdatedBy,
    createdAt,
    updatedAt
  }) {
    // setup the error message
    this.baseErrorMessage = `${this.constructor.name} failed to create: `;

    // Parameter validation
    this.validateUuids({ id, version, documentId, lastUpdatedBy });
    this.checkBlockType(type);
    this.validateTimeString({ createdAt, updatedAt }, ['createdAt', 'updatedAt']);

    // Storing values
    this.id = id;
    this.type = type;
    this.version = version;
    this.documentId = documentId;
    this.lastUpdatedBy = lastUpdatedBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  private validateUuids(input: any) {
    Object.keys(input).forEach(property => {
      if (!isUuid(input[property])) {
        throw new Error(this.baseErrorMessage + `${property} must be a valid uuid`);
      }
    });
  }

  private checkBlockType(type: any) {
    if (!Object.values(BlockType).includes(type)) {
      throw new Error(this.baseErrorMessage + 'BlockType not supported');
    }
  }

  private validateTimeString(input: any, properties: Array<string>) {
    properties.forEach(property => {
      if (
        input[property] === null ||
        input[property] === undefined ||
        !isValidDateString(input[property])
      ) {
        const detail = `${property} must be a valid time string`;
        throw new Error(this.baseErrorMessage + detail);
      }
    });
  }
}
