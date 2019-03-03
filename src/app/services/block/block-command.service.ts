import { Injectable } from '@angular/core';
import { Block } from '../../classes/block';
import { Observable } from 'rxjs';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { BlockQueryService } from './block-query.service';
import { CreateBlockInput, UpdateBlockInput, CreateTextBlockInput, BlockType } from '../../../API';
import { createTextBlock } from '../../../graphql/mutations';

@Injectable({
  providedIn: 'root'
})
export class BlockCommandService {

  constructor(
    private graphQLService: GraphQLService,
    private blockQueryService: BlockQueryService
  ) { }

  updateBlock$(input: UpdateBlockInput): Observable<Block> {
    return null;
  }

  /**
   * Create the block in the database
   * @param version the version of the block
   * @param type the type of the block
   * @param documentId the id of the document the block belongs to
   * @param lastUpdatedBy the id of the author who initiated this update
   * @param options other options depending what kind of block it is
   * @return the observable for the created block
   */
  createBlock(input: CreateBlockInput | CreateTextBlockInput): Promise<any> {
    switch (input.type) {
      case BlockType.TEXT:
        return this.createTextBlock(input);
      default:
        return Promise.reject('BlockType not supported');
    }
  }

  private async createTextBlock(input: CreateBlockInput): Promise<any> {
    const requiredParams = [
      'id', 'version', 'type', 'documentId', 'lastUpdatedBy', 'value'
    ]
    try {
      this.checkForNullOrUndefined(input, requiredParams, 'CreateTextBlockInput');

      this.blockQueryService.registerUpdateVersion(input.version);

      return this.graphQLService.query(createTextBlock, { input });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private checkForNullOrUndefined(input: any, paramNames: Array<string>, context: string) {
    paramNames.forEach(param => {
      const value = input[param];
      if (value === undefined || value === null) {
        throw new Error(`Missing argument "${param}" in ${context}`);
      }
    });
  }
}
