import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Block } from '../../classes/block';

@Injectable({
  providedIn: 'root'
})
export class BlockQueryService {

  private myVersions: Array<string> = [];

  constructor() { }

  getBlock$(id: string): Observable<Block> {
    return;
  }
  getBlocksForDocument(id: string): Promise<any> {
    return;
  }
  registerUpdateVersion(version: string) {

  }
  subscribeToUpdate(documentId: string): Promise<any> {
    return;
  }
}
