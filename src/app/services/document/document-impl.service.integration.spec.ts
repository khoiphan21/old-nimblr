import { TestBed } from '@angular/core/testing';

import { DocumentService } from './document.service';
import { AccountService } from '../account/account.service';
import { ServicesModule } from 'src/app/modules/services.module';

import { DocumentImpl } from 'src/app/classes/document/document-impl';
import { RouterTestingModule } from '@angular/router/testing';
import { skip, take } from 'rxjs/operators';
import { processTestError } from 'src/app/classes/test-helpers.spec';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { createDocument, deleteDocument } from '../../../graphql/mutations';
import { CreateDocumentInput, DocumentType, SharingStatus } from '../../../API';
import { Document } from 'src/app/classes/document/document';
import { User } from 'src/app/classes/user';
import { DocumentCommandService } from './command/document-command.service';
import { TEST_USERNAME, TEST_PASSWORD } from '../loginHelper';
import { configureTestSuite } from 'ng-bullet';

const uuidv4 = require('uuid/v4');

describe('(Integration) DocumentService', () => {
  let service: DocumentService;
  let commandService: DocumentCommandService;
  let accountService: AccountService;
  let graphQlService: GraphQLService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentService
      ],
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([])
      ]
    });
  });

  beforeEach(() => {

    accountService = TestBed.get(AccountService);
    service = TestBed.get(DocumentService);
    commandService = TestBed.get(DocumentCommandService);
    graphQlService = TestBed.get(GraphQLService);
  });

  it('should retrieve all documents for a user', done => {
    let document: Document;
    const input: CreateDocumentInput = {
      type: DocumentType.GENERIC,
      version: uuidv4(),
      ownerId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      sharingStatus: SharingStatus.PRIVATE
    };

    accountService.login(TEST_USERNAME, TEST_PASSWORD).then((user: User) => {
      input.ownerId = user.id;
      return graphQlService.query(createDocument, { input });
    }).then(response => {
      document = response.data.createDocument;
      return getFirstDocumentSet();
    }).then(documents => {
      expect(documents.length).toBeGreaterThan(0);
      expect(documents[0] instanceof DocumentImpl).toBe(true);
      return graphQlService.query(deleteDocument, { input: { id: document.id } });
    }).then(() => done()
    ).catch(error => processTestError('failed to retrieve docs', error, done));

    function getFirstDocumentSet(): Promise<Array<Document>> {
      return new Promise((resolve, reject) => {
        const subscription = service.getUserDocuments$();
        subscription.pipe(skip(1)).pipe(take(1)).subscribe(documents => {
          if (documents === null) { return; }
          resolve(documents);
        }, error => reject(error));
      });
    }
  });
});

