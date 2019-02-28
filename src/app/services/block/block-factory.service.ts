import { Injectable } from '@angular/core';
import { Block } from '../../classes/block';

@Injectable({
  providedIn: 'root'
})
export class BlockFactoryService {

  constructor() { }

  createBlock(rawBlockData): Block {
    return null;
  }
}
