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

  createBlock(version: string, type: BlockType, documentId: string,
              lastUpdatedBy: string, options: BlockMutationOptions): Observable<Block> {
    return;
  }
}
