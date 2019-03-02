import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Block } from '../../classes/block';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { BlockFactoryService } from './block-factory.service';
import { getBlock } from '../../../graphql/queries';

@Injectable({
  providedIn: 'root'
})
export class BlockQueryService {

  private myVersions: Array<string> = [];
  private blocksMap: Map<string, Observable<Block>> = new Map();

  constructor(
    private graphQlService: GraphQLService,
    private blockFactoryService: BlockFactoryService
  ) { }

  getBlock$(id: string): Observable<Block> {
    if (this.blocksMap.has(id)) {
      return this.blocksMap.get(id);
    }

    const block$ = new BehaviorSubject<Block>(null);
    this.blocksMap.set(id, block$);

    this.graphQlService.query(getBlock, { id }).then(response => {
      try {
        const data = response.data.getBlock;
        if (data === null) {
          block$.next(null);
          return;
        }
        const block: Block = this.blockFactoryService.createBlock(data);
        block$.next(block);
      } catch (error) {
        block$.error(error);
      }
    });

    return block$;
  }

  getBlocksForDocument(id: string): Promise<any> {
    return;
  }
  registerUpdateVersion(version: string) {
    
  }
  private subscribeToUpdate(documentId: string): Promise<any> {
    return;
  }
}
