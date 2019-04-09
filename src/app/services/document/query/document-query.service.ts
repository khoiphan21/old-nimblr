import { Injectable } from '@angular/core';
import { Document } from 'src/app/classes/document/document';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { GraphQLService } from '../../graphQL/graph-ql.service';
import { getDocument } from '../../../../graphql/queries';
import { DocumentFactoryService } from '../factory/document-factory.service';
import { onSpecificDocumentUpdate } from '../../../../graphql/subscriptions';

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

  /**
   * Get the observable for the document with the given id.
   * Whenever there's an update, this observable will emit the updated values
   *
   * @param id the id of the document
   */
  getDocument$(id: string): Observable<Document> {
    if (!this.documentMap.has(id)) {
      this.documentMap.set(id, new BehaviorSubject<Document>(null));
    }
    const document$ = this.documentMap.get(id);

    // setup subscription if not yet done
    if (!this.subscriptionMap.has(id)) {
      this.subscribeToUpdate(id);
    }

    this.graphQlService.query(getDocument, { id }).then(response => {

      try {
        const document: Document = this.parseDocument(response, id);
        document$.next(document);
      } catch (error) {
        document$.error(error);
      }

    }).catch(error =>
      document$.error(Error(`[DocumentQueryService] Unable to send query: ${error.message}`))
    );

    return document$;
  }

  /**
   * Parse the raw response from getDocument query
   *
   * @param response the raw response from the backend
   * @param id The id of the document, for error message formatting
   */
  private parseDocument(response: any, id: string): Document {
    let rawData: any;

    try {
      rawData = response.data.getDocument;
    } catch (error) {
      throw new Error(`Unable to parse response: ${error.message}`);
    }

    if (rawData === null) {
      throw new Error(`Document with id ${id} does not exist`);
    }

    const document: Document = this.documentFactory.createDocument(rawData);

    return document;
  }

  /**
   * Register a specific version into the list of 'ignored' notifications.
   *
   * Essentially, when a notification comes, its version is checked against the
   * internal list of versions. If there's a match, the notification will be ignored
   *
   * @param version the version of the document to be ignored
   */
  registerUpdateVersion(version: string) {
    this.myVersions.add(version);
  }

  /**
   * Subscribe to any changes to the document notified by GraphQL.
   *
   * Whenever a notification is received, the document observable will emit the
   * updated document if the version is a new version.
   *
   * @param documentId the id of the document to subscribe to
   */
  private subscribeToUpdate(documentId: string) {
    const document$ = this.documentMap.get(documentId);

    const subscription = this.graphQlService.getSubscription(
      onSpecificDocumentUpdate, { id: documentId }
    ).subscribe(notification => {
      try {
        const document = this.parseNotification(notification);
        if (!this.myVersions.has(document.version)) {
          document$.next(document);
        }
      } catch (error) {
        document$.error(error);
      }
    }, error => {
      // Note: need to delete the subscription from the map first
      this.subscriptionMap.delete(documentId);
      // and then emit the error
      document$.error(Error(`Error from notification: ${error.message}`));
    });

    this.subscriptionMap.set(documentId, subscription);
  }

  /**
   * Parse the raw notification and return the document created.
   *
   * @param notification the raw notification from the backend
   */
  private parseNotification(notification: any): Document {
    let rawData: any;
    let document: Document;

    // Check if the data returned is in the expected format
    try {
      rawData = notification.value.data.onSpecificDocumentUpdate;
    } catch (error) {
      throw new Error(`Unable to parse data: ${error.message}`);
    }

    // check if createDocument can be called successfully
    try {
      document = this.documentFactory.createDocument(rawData);
    } catch (error) {
      throw new Error(`DocumentFactory failed to create document: ${error.message}`);
    }

    return document;
  }

}
