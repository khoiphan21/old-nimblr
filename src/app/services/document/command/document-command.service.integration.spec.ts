import { TestBed } from '@angular/core/testing';

import { DocumentCommandService } from './document-command.service';
import { BehaviorSubject } from 'rxjs';
import { GraphQLService } from '../../graphQL/graph-ql.service';
import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../../account/account-impl.service.spec';
import { CreateDocumentInput, DocumentType, UpdateDocumentInput, SharingStatus } from '../../../../API';
import { deleteDocument } from '../../../../graphql/mutations';

const uuidv4 = require('uuid/v4');

describe('(Integration) DocumentCommandService', () => {
  const service$ = new BehaviorSubject<DocumentCommandService>(null);
  let graphQlService: GraphQLService;

  let input: CreateDocumentInput;
  let storedDocument: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    input = {
      type: DocumentType.GENERIC,
      version: uuidv4(),
      ownerId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      sharingStatus: SharingStatus.PRIVATE
    };
    graphQlService = TestBed.get(GraphQLService);
  });

  beforeAll(() => {
    Auth.signIn(TEST_USERNAME, TEST_PASSWORD).then(() => {
      service$.next(TestBed.get(DocumentCommandService));
    }).catch(error => service$.error(error));
  });

  async function getService(): Promise<DocumentCommandService> {
    return new Promise((resolve, reject) => {
      service$.subscribe(service => {
        if (service === null) { return; }
        resolve(service);
      }, error => reject(error));
    });
  }

  describe('createDocument', () => {

    it('should create a GENERIC document', done => {
      getService().then(service => {
        return service.createDocument(input);
      }).then(createdDocument => {
        storedDocument = createdDocument;
        expect(createdDocument).toBeTruthy();
        return graphQlService.query(deleteDocument, { input: { id: storedDocument.id } });
      }).then(response => {
        const deletedDocument = response.data.deleteDocument;
        expect(deletedDocument.id).toEqual(storedDocument.id);
        done();
      }).catch(error => console.error(error));
    }, 10000);

  });

  describe('updateDocument for FORM', () => {

    it('should update a document with new values', done => {
      let service: DocumentCommandService;
      const updatedInput: UpdateDocumentInput = {
        id: null,
        title: 'test title',
        version: uuidv4(),
        lastUpdatedBy: uuidv4(),
        updatedAt: new Date().toISOString()
      };

      getService().then(retrievedService => {
        service = retrievedService;
        return service.createDocument(input);
      }).then(createdDocument => {
        storedDocument = createdDocument;
        // Update the input
        updatedInput.id = storedDocument.id;
        return service.updateDocument(updatedInput);
      }).then(updatedDocument => {
        verifyUpdatedDocument(updatedDocument);
        return graphQlService.query(
          deleteDocument, { input: { id: storedDocument.id } }
        );
      }).then(response => {
        const deletedDocument = response.data.deleteDocument;
        expect(deletedDocument.id).toEqual(storedDocument.id);
        done();
      }).catch(error => console.error(error));

      function verifyUpdatedDocument(document) {
        expect(document.id).toEqual(updatedInput.id);
        expect(document.title).toEqual(updatedInput.title);
      }

    });

  });
});
