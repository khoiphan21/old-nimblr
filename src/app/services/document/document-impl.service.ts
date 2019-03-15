import { Injectable } from '@angular/core';
import { DocumentService } from './document.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Document } from '../../classes/document';
import { AccountService } from '../account/account.service';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { User } from '../../classes/user';
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../../../graphql/mutations';
import * as queries from '../../../graphql/queries';
import * as subscriptions from '../../../graphql/subscriptions';
import { CreateDocumentInput, DocumentType } from '../../../API';
import { Deferred } from '../../classes/deferred';
import { DocumentFactoryService } from './factory/document-factory.service';


@Injectable({
  providedIn: 'root'
})
export class DocumentServiceImpl implements DocumentService {

  private currentDocument$: BehaviorSubject<Document> = new BehaviorSubject(null);
  private userDocuments$: BehaviorSubject<Array<Document>>;

  constructor(
    private accountService: AccountService,
    private documentFactory: DocumentFactoryService,
    private graphQlService: GraphQLService
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

    const response: any = await this.graphQlService.query(
      queries.listDocuments, queryParams
    );

    const documentPromisses: Array<Promise<Document>> = response.data.listDocuments.items.map(rawDocument => {
      return this.documentFactory.createDocument(rawDocument);
    });

    Promise.all(documentPromisses).then((documents: Array<Document>) => {
      deferred.resolve(documents);
    });

    return deferred.promise;
  }

  async createFormDocument(): Promise<Document> {
    const deferred: Deferred<Document> = new Deferred();

    try {
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
      const document = this.documentFactory.createDocument(rawDocument);
      
      this.currentDocument$.next(document);
      deferred.resolve(document);
    } catch (error) {
      console.error('error received in createFormDocument()');
      deferred.reject(error);
    }


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
      }).catch(error => {
        console.error('Error in getUserDocuments$');
        this.userDocuments$.error(error);
      });
    }
    return this.userDocuments$;
  }

  private async setupSubscriptionForUserDocuments() {
    try {
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
    } catch (error) {
      console.error('Error setting up subscription for user documents. More details below.');
      console.error(error);
    }
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
