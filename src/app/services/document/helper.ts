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
    const response = await this.graphQlService.query(createDocument, { input });

    this.documentId = response.data.createDocument.id;
    this.createdDocument = response.data.createDocument;
    this.latestResponse = response;

    return response.data.createDocument;
  }

  async sendUpdateDocument(input: UpdateDocumentInput, delay = 0): Promise<any> {
    await sleep(delay);
    const res = await this.graphQlService.query(updateDocument, { input });
    this.latestResponse = res;
    return res.data.updateDocument;
  }

  async deleteDocument(): Promise<any> {
    const response = await this.graphQlService.query(deleteDocument, {
      input: { id: this.documentId }
    });

    this.documentId = null;
    this.latestResponse = response;

    return response.data.deleteDocument;
  }

  getLatestResponse(): any {
    return this.latestResponse;
  }

  getCreatedDocument(): any {
    return this.createdDocument;
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
