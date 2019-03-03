import { GraphQLService } from '../graphQL/graph-ql.service';
import { CreateDocumentInput, UpdateDocumentInput } from '../../../API';
import { createDocument, deleteDocument, updateDocument } from '../../../graphql/mutations';

export class DocumentQueryTestHelper {

  private documentId: string;
  private latestResponse: any;

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
      this.latestResponse = response;

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async sendUpdateDocument(input: UpdateDocumentInput): Promise<any> {
    try {
      const response = await this.graphQlService.query(updateDocument, { input });
      this.latestResponse = response;

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteDocument(): Promise<any> {
    try {
      const response = await this.graphQlService.query(deleteDocument, {
        input: { id: this.documentId }
      });

      this.documentId = null;
      this.latestResponse = response;

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getLatestResponse(): any {
    return this.latestResponse;
  }
}
