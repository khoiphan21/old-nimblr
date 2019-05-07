import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Block } from '../../../classes/block/block';
import { GraphQLService } from '../../graphQL/graph-ql.service';
import { BlockFactoryService } from '../factory/block-factory.service';
import { getBlock, listBlocks } from '../../../../graphql/queries';
import { onUpdateBlockInDocument } from '../../../../graphql/subscriptions';
import { VersionService } from '../../version/version.service';

@Injectable({
  providedIn: 'root'
})
export class BlockQueryService {

  private blocksMap: Map<string, BehaviorSubject<Block>> = new Map();
  private subscriptionMap: Map<string, Observable<Subscription>> = new Map();

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

  /**
   * Process the raw block data retrieved from the server
   *
   * @param data the raw block data
   * @param block$ the block observable
   * @param subscribe a boolean flag to specify whether the subscription setup code should be run
   */
  private processRaw(data, block$: BehaviorSubject<Block>) {
    try {
      const block: Block = this.blockFactoryService.createAppBlock(data);
      // This is needed for when called by getBlocksForDocument
      this.blocksMap.set(block.id, block$);
      block$.next(block);
    } catch (error) {
      block$.error(error);
    }
  }

  async getBlocksForDocument(id: string): Promise<Array<Block>> {
    return new Promise((resolve, reject) => {
      const params = {
        filter: {
          documentId: { eq: id }
        }
      };

      this.graphQlService.list({
        query: listBlocks,
        queryName: 'listBlocks',
        params,
        listAll: true
      }).then(response => {
        resolve(response.items);
      }).catch(error => reject(error));
    });
  }

  async getBlocksObservablesForDocument(id: string): Promise<Array<Observable<Block>>> {
    return new Promise((resolve, reject) => {
      const params = {
        filter: {
          documentId: { eq: id }
        }
      };

      this.graphQlService.list({
        query: listBlocks,
        queryName: 'listBlocks',
        params,
        listAll: true
      }).then(response => {
        resolve(this.processMultipleRaw(response.items));
      }).catch(error => reject(error));
    });
  }

  private processMultipleRaw(items: any): Array<Observable<Block>> {
    const observables: Array<Observable<Block>> = [];

    items.forEach(rawBlock => {
      const blockObservable = new BehaviorSubject(null);
      observables.push(blockObservable);
      this.processRaw(rawBlock, blockObservable);
    });

    return observables;
  }

  subscribeToUpdate(documentId: string): Observable<Subscription> {
    if (this.subscriptionMap.has(documentId)) {
      // If not empty:
      return this.subscriptionMap.get(documentId);
    }

    // Else setup a new observable
    const subject = new BehaviorSubject<Subscription>(null);
    this.subscriptionMap.set(documentId, subject);

    // subscribe to graphql subscription
    const subscription = this.graphQlService.getSubscription(
      onUpdateBlockInDocument, { documentId }
    ).subscribe(response => {
      // Process the block notified by graphql
      const data = response.value.data.onUpdateBlockInDocument;
      this.processBlockNotification(data);
    }, error => subject.error(error));

    subject.next(subscription);

    return subject;
  }

  private processBlockNotification(data) {
    // Create the block from the raw data
    const block: Block = this.blockFactoryService.createAppBlock(data);

    // Retrieve the block subject
    let block$: BehaviorSubject<Block>;
    if (!this.blocksMap.has(block.id)) {
      block$ = new BehaviorSubject<Block>(null);
      this.blocksMap.set(block.id, block$);
    } else {
      block$ = this.blocksMap.get(block.id) as BehaviorSubject<Block>;
    }

    // This is needed for when called by getBlocksForDocument
    this.blocksMap.set(block.id, block$);
    block$.next(block);
  }

  registerBlockCreatedByUI(block: Block) {
    const block$ = new BehaviorSubject<Block>(null);
    this.blocksMap.set(block.id, block$);
    block$.next(block);
  }

  registerBlockDeletedByUI(blockId: string) {
    this.blocksMap.delete(blockId);
  }

  /**
   * Update block's UI from conversion
   *
   * @param block the block
   */
  updateBlockUI(block: Block) {
    const id = block.id;
    let block$: Subject<Block>;
    if (this.blocksMap.has(id)) {
      block$ = this.blocksMap.get(id);
      block$.next(block);
    }
  }
}
