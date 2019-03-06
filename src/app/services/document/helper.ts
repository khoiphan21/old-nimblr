import { GraphQLService } from '../graphQL/graph-ql.service';
import { CreateDocumentInput, UpdateDocumentInput } from '../../../API';
import { createDocument, deleteDocument, updateDocument } from '../../../graphql/mutations';

export class DocumentQueryTestHelper {

  private documentId: string;
  private latestResponse: any;
  private createdDocument: any;

  constructor(
    private graphQlService: GraphQLService
  ) { }

  /**
   * Create a document in the backend database
   * @param input the arguments to create a document
   * @returns the response from the backend
   */
  async sendCreateDocument(input: CreateDocumentInput): Promise<any> {
    try {
      const response = await this.graphQlService.query(createDocument, { input });

      this.documentId = response.data.createDocument.id;
      this.createdDocument = response.data.createDocument;
      this.latestResponse = response;

      return Promise.resolve(response.data.createDocument);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async sendUpdateDocument(input: UpdateDocumentInput, delay = 0): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.graphQlService.query(updateDocument, { input }).then(response => {
          this.latestResponse = response;
          resolve(response.data.updateDocument);
        }).catch(error => {
          reject(error);
        });
      }, delay);
    });
  }

  async deleteDocument(): Promise<any> {
    try {
      const response = await this.graphQlService.query(deleteDocument, {
        input: { id: this.documentId }
      });

      this.documentId = null;
      this.latestResponse = response;

      return Promise.resolve(response.data.deleteDocument);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getLatestResponse(): any {
    return this.latestResponse;
  }

  getCreatedDocument(): any {
    return this.createdDocument;
  }
}
