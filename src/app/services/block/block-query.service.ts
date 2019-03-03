import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Block } from '../../classes/block';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { BlockFactoryService } from './block-factory.service';
import { getBlock } from '../../../graphql/queries';
import { onUpdateBlockInDocument } from '../../../graphql/subscriptions';

@Injectable({
  providedIn: 'root'
})
export class BlockQueryService {

  private myVersions: Set<string> = new Set();
  private blocksMap: Map<string, Observable<Block>> = new Map();

  constructor(
    private graphQlService: GraphQLService,
    private blockFactoryService: BlockFactoryService
  ) { }

  getBlock$(id: string): Observable<Block> {
    if (this.blocksMap.has(id)) {
      return this.blocksMap.get(id);
    }
    // Create a new Block observable and store it
    const block$ = new BehaviorSubject<Block>(null);
    this.blocksMap.set(id, block$);

    // Retrieve the query
    this.graphQlService.query(getBlock, { id }).then(response => {
      const data = response.data.getBlock;
      this.processRaw(data, block$);
    });

    return block$;
  }

  getBlocksForDocument(id: string): Promise<any> {
    return;
  }
  registerUpdateVersion(version: string) {
    this.myVersions.add(version);
  }

  private subscribeToUpdate(documentId: string, blockId: string): Promise<any> {
    const block$ = this.blocksMap.get(blockId) as BehaviorSubject<Block>;

    // subscribe to graphql subscription
    this.graphQlService.getSubscription(onUpdateBlockInDocument, { documentId }).subscribe(response => {
      const data = response.value.data.onUpdateBlockInDocument;
      this.processRaw(data, block$, false);
    }, error => block$.error(error));

    return Promise.resolve();
  }

  /**
   * Process the raw block data retrieved from the server
   * 
   * @param data the raw block data
   * @param block$ the block observable
   * @param subscribe a boolean flag to specify whether the subscription setup code should be run
   */
  private processRaw(data, block$: BehaviorSubject<Block>, subscribe = true) {
    try {
      const block: Block = this.blockFactoryService.createBlock(data);
      if (subscribe) {
        this.subscribeToUpdate(block.documentId, block.id);
      }
      if (!this.myVersions.has(block.version)) {
        // To ensure only other versions will be updated
        block$.next(block);
      }
    } catch (error) {
      block$.error(error);
    }
  }
}
