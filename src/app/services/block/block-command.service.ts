import { Injectable } from '@angular/core';
import { BlockType, BlockUpdateOptions, Block } from '../../classes/block';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlockCommandService {

  constructor() { }

  updateBlock$(id: string, type: BlockType, options: BlockUpdateOptions): Observable<Block> {
    return null;
  }
}
