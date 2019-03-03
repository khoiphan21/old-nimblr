import { Injectable } from '@angular/core';
import { Document } from 'src/app/classes/document';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { getDocument } from '../../../graphql/queries';
import { DocumentFactoryService } from './document-factory.service';

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
    const document$ = new BehaviorSubject<Document>(null);

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

  }

}
