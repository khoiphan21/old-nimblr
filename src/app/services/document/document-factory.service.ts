import { Injectable } from '@angular/core';
import { User } from 'src/app/classes/user';
import { DocumentImpl } from '../../classes/document-impl';
import { Document } from 'src/app/classes/document';
import { UserFactoryService } from '../user/user-factory.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentFactoryService {

  constructor(
    private userFactory: UserFactoryService
  ) { }

  async createDocument(rawDocument: any): Promise<Document> {
    return new Promise((resolve, reject) => {
      try {
        // Retrieve editors and viewers
        Promise.all([
          this.userFactory.getUserFromIds([rawDocument.ownerId]),
          this.userFactory.getUserFromIds(rawDocument.editorIds),
          this.userFactory.getUserFromIds(rawDocument.viewerIds)
        ]).then(result => {
          const owner: User = result[0][0];
          const editors: User[] = result[1];
          const viewers: User[] = result[2];
          resolve(new DocumentImpl(
            rawDocument.id,
            rawDocument.type,
            rawDocument.title,
            owner,
            editors,
            viewers,
            rawDocument.order
          ));
        });
      } catch (error) {
        reject(error);
      }

    });
  }
}
