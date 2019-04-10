import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Document } from '../../classes/document/document';
import { AccountService } from '../account/account.service';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { User } from '../../classes/user';
import { DocumentType } from '../../../API';
import { DocumentFactoryService } from './factory/document-factory.service';
import { listDocuments } from 'src/graphql/queries';
import { createDocument, deleteDocument } from 'src/graphql/mutations';
import { onCreateDocument } from 'src/graphql/subscriptions';
import { GraphQLError } from '../graphQL/error';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private userDocuments$: BehaviorSubject<Array<Document>>;

  constructor(
    private accountService: AccountService,
    private documentFactory: DocumentFactoryService,
    private graphQlService: GraphQLService
  ) {
  }

  /**
   * Retrieve the list of documents for a certain user
   *
   * @param userId the id of the user to retrieve documents
   */
  private async getDocumentsForUserId(userId: string): Promise<Array<Document>> {
    let response: any; // response from the backend

    // setup the arguments for the query
    const queryArgs = {
      filter: {
        ownerId: {
          eq: userId
        }
      }
    };

    // Retrieve the list of raw documents from the backend
    try {
      response = await this.graphQlService.list({
        query: listDocuments,
        queryName: 'listDocuments',
        params: queryArgs,
        listAll: true,
        limit: 100
      });
    } catch (error) {
      throw new GraphQLError({
        message: `failed to retrieve documents for user ${userId}`,
        query: listDocuments,
        params: queryArgs,
        backendResponse: error
      });
    }
    const documents: Array<any> = response.items;
    console.log(documents);

    // Convert the raw documents into Document objects
    const parsedDocuments: Array<Document> = documents.map(
      (rawDocument: any) => {
        return this.documentFactory.createDocument(rawDocument);
      }
    );

    return parsedDocuments;
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
      }).catch(() => {
        const message = 'Error getting documents: User is not logged in';
        this.userDocuments$.error(message);
      });
    }
    return this.userDocuments$;
  }

  private async setupSubscriptionForUserDocuments(): Promise<any> {
    let user: User;
    // Check if the user is logged in
    try {
      user = await this.accountService.isUserReady();
    } catch {
      throw new Error('Unable to setup subscription for user documents');
    }
    this.graphQlService.getSubscription(onCreateDocument).subscribe(() => {
      this.getDocumentsForUserId(user.id).then(
        documents => {
          this.userDocuments$.next(documents);
        }
      );
    }, () => { // error pathway
      const message = `Unable to setup subscription for user documents: failed to call graphQl`;
      this.userDocuments$.error(message);
    });
  }

  async deleteDocument(id: string): Promise<any> {
    return this.graphQlService.query(deleteDocument, { input: { id } })
      .catch(error => {
        const message = `Unable to delete document: ${error.message}`;
        return Promise.reject(Error(message));
      });
  }

}
