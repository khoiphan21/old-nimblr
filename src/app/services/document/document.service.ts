import { Observable } from 'rxjs';
import { Document } from '../../classes/document';

export abstract class DocumentService {
  abstract async createFormDocument(): Promise<Document>;
  abstract getUserDocuments$(): Observable<Array<Document>>;
  abstract getCurrentDocument$(): Observable<Document>;
  abstract async deleteDocument(id: string): Promise<any>;
}
