import { Injectable } from '@angular/core';
import { BlockType, BlockMutationOptions, Block } from '../../classes/block';
import { Observable } from 'rxjs';
import { GraphQLService } from '../graphQL/graph-ql.service';

@Injectable({
  providedIn: 'root'
})
export class BlockCommandService {

  constructor(
    private graphQLService: GraphQLService
  ) { }

  updateBlock$(id: string, type: BlockType,
               options: BlockMutationOptions): Observable<Block> {
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
  createBlock(version: string, type: BlockType, documentId: string,
              lastUpdatedBy: string, options: BlockMutationOptions): Observable<Block> {
    return;
  }
}
