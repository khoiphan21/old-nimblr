import { Injectable } from '@angular/core';
import { Document } from 'src/app/classes/document';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { getDocument } from '../../../graphql/queries';
import { DocumentFactoryService } from './document-factory.service';
import { onUpdateDocument, onSpecificDocumentUpdate } from '../../../graphql/subscriptions';

@Injectable({
  providedIn: 'root'
})
export class DocumentQueryService {

  private myVersions: Set<string> = new Set();
  private documentMap: Map<string, BehaviorSubject<Document>> = new Map();
  private subscriptionMap: Map<string, Subscription> = new Map();

  constructor(
    private graphQlService: GraphQLService,
    private documentFactory: DocumentFactoryService
  ) { }

  getDocument$(id: string): Observable<Document> {
    if (!this.documentMap.has(id)) {
      this.documentMap.set(id, new BehaviorSubject<Document>(null))
    }
    const document$ = this.documentMap.get(id);

    // setup subscription if not yet done
    if (!this.subscriptionMap.has(id)) {
      this.subscribeToUpdate(id);
    }

    this.graphQlService.query(getDocument, { id }).then(response => {
      const rawData = response.data.getDocument;
      if (rawData === null) {
        document$.error(`Document with id ${id} does not exist`);
        return;
      }
      return this.documentFactory.createDocument(rawData);
    }).then(document => {
      document$.next(document);
    }).catch(error => document$.error(error));

    return document$;
  }

  registerUpdateVersion(version: string) {
    this.myVersions.add(version);
  }

  private subscribeToUpdate(documentId: string) {
    // Get the subscription from graphql
    const subscription = this.graphQlService.getSubscription(
      onSpecificDocumentUpdate, { id: documentId }
    ).subscribe(notification => {
      // Notification received
      const rawData = notification.value.data.onSpecificDocumentUpdate;
      // Check if the version is in myVersions
      if (this.myVersions.has(rawData.version)) {
        return;
      }
      // Convert raw data into the app Document
      this.documentFactory.createDocument(rawData).then((document: Document) => {
        // Emit the new data
        this.documentMap.get(documentId).next(document);
      }).catch(error => console.error(error));
    });
    this.subscriptionMap.set(documentId, subscription);
  }

}
