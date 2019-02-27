import { Injectable } from '@angular/core';
import { DocumentService } from './document.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Document, DocumentType } from '../../classes/document';
import { AccountService } from '../account/account.service';
import { User } from '../../classes/user';
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../../../graphql/mutations';
import * as queries from '../../../graphql/queries';
import * as subscriptions from '../../../graphql/subscriptions';
import { CreateDocumentInput, CreateDocumentMutation } from '../../../API';
import { UserFactoryService } from '../user/user-factory.service';
import { DocumentImpl } from '../../classes/document-impl';
import { Deferred } from '../../classes/deferred';


@Injectable({
  providedIn: 'root'
})
export class DocumentServiceImpl implements DocumentService {

  private currentDocument$: BehaviorSubject<Document> = new BehaviorSubject(null);
  private userDocuments$: BehaviorSubject<Array<Document>>;

  constructor(
    private accountService: AccountService,
    private userFactory: UserFactoryService,
  ) {
  }

  private async getDocumentsForUserId(userId: string): Promise<Array<Document>> {
    const deferred: Deferred<Array<Document>> = new Deferred();

    const queryParams = {
      filter: {
        ownerId: {
          eq: userId
        }
      }
    };

    const response: any = await API.graphql(
      graphqlOperation(queries.listDocuments, queryParams)
    );

    const documentPromisses: Array<Promise<Document>> = response.data.listDocuments.items.map(rawDocument => {
      return DocumentFactory.createDocument(rawDocument, this.userFactory);
    });

    Promise.all(documentPromisses).then((documents: Array<Document>) => {
      deferred.resolve(documents);
    });

    return deferred.promise;
  }

  async createFormDocument(): Promise<Document> {
    const deferred: Deferred<Document> = new Deferred();

    const user = await this.accountService.isUserReady();

    const documentDetails = {
      type: DocumentType.FORM,
      title: null,
      ownerId: user.id,
      editorIds: [],
      viewerIds: [],
      order: [],
    } as CreateDocumentInput;

    const response: any = await API.graphql(
      graphqlOperation(mutations.createDocument, { input: documentDetails })
    );

    const rawDocument = response.data.createDocument;

    // Create a document, then emit the newly created document
    DocumentFactory.createDocument(rawDocument, this.userFactory).then(document => {
      this.currentDocument$.next(document);
      deferred.resolve(document);
    });

    return deferred.promise;
  }

  getCurrentDocument$(): Observable<Document> {
    return this.currentDocument$;
  }

  getUserDocuments$(): Observable<Array<Document>> {
    if (!this.userDocuments$) {
      this.setupSubscriptionForUserDocuments();
      this.userDocuments$ = new BehaviorSubject([]);
      this.accountService.isUserReady().then((user: User) => {
        this.getDocumentsForUserId(user.id).then(
          documents => {
            this.userDocuments$.next(documents);
          }
        );
      });
    }
    return this.userDocuments$;
  }

  private async setupSubscriptionForUserDocuments() {

    const user: User = await this.accountService.isUserReady();
    const subscription: any = API.graphql(
      graphqlOperation(subscriptions.onCreateDocument)
    );
    subscription.subscribe(response => {
      this.getDocumentsForUserId(user.id).then(
        documents => {
          this.userDocuments$.next(documents);
        }
      );
    });
  }

  async deleteDocument(id: string): Promise<any> {
    try {
      const params = {
        input: {
          id: id
        }
      };
      const deletedDocument = await API.graphql(
        graphqlOperation(mutations.deleteDocument, params)
      );
      return Promise.resolve(deletedDocument);
    } catch (error) {
      return Promise.reject(error);
    }
  }

}

export class DocumentFactory {

  static async createDocument(
    rawDocument: any,
    userFactory: UserFactoryService
  ): Promise<Document> {
    return new Promise((resolve, reject) => {
      try {
        // Retrieve editors and viewers
        Promise.all([
          userFactory.getUserFromIds([rawDocument.ownerId]),
          userFactory.getUserFromIds(rawDocument.editorIds),
          userFactory.getUserFromIds(rawDocument.viewerIds)
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
