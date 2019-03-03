import { Injectable } from '@angular/core';
import { Block } from '../../classes/block';
import { Observable } from 'rxjs';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { BlockQueryService } from './block-query.service';
import { CreateBlockInput, UpdateBlockInput } from '../../../API';

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
  createBlock(input: CreateBlockInput): Observable<Block> {
    return;
  }
}
