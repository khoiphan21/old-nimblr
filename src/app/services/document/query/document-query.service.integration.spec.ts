import { TestBed } from '@angular/core/testing';

import { DocumentQueryService } from './document-query.service';
import { Auth } from 'aws-amplify';
import { GraphQLService } from '../../graphQL/graph-ql.service';
import { CreateDocumentInput, DocumentType, SharingStatus } from '../../../../API';
import { DocumentQueryTestHelper } from '../helper';
import { environment } from '../../../../environments/environment';
import { LoginHelper, TEST_USERNAME, TEST_PASSWORD } from '../../loginHelper';

const uuidv4 = require('uuid/v4');

describe('(Integration) DocumentQueryService', () => {
  let service: DocumentQueryService;
  let graphQlService: GraphQLService;
  let input: CreateDocumentInput;

  TestBed.configureTestingModule({});

  beforeEach(async () => {
    resetInput();

    const user = await LoginHelper.login();
    // store the id of the user to create relevant documents.
    // Only owners of the document can retrieve it for now.
    input.ownerId = user.idToken.payload.sub;

    service = TestBed.get(DocumentQueryService);
    graphQlService = TestBed.get(GraphQLService);
  });

  function resetInput() {
    input = {
      id: uuidv4(),
      version: uuidv4(),
      ownerId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      title: 'test title',
      sharingStatus: SharingStatus.PRIVATE,
      type: DocumentType.GENERIC
    };
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDocument$', () => {
    let helper: DocumentQueryTestHelper;

    beforeEach(() => {
      helper = new DocumentQueryTestHelper(TestBed.get(GraphQLService));
      input.id = uuidv4();
    });

    it('should return a previously created document', async () => {
      await helper.sendCreateDocument(input);

      const retrievedDocument = await getFirstDocument();
      expect(retrievedDocument.id).toEqual(helper.getCreatedDocument().id);
      expect(retrievedDocument.title).toEqual(helper.getCreatedDocument().title);

      await helper.deleteDocument();
    });

    it('should subscribe to any changes from the backend', async done => {
      const title = 'title from getDocument$ subscription test';
      const createdDocument = await helper.sendCreateDocument(input);

      setupSubscriptionTest();

      await helper.sendUpdateDocument({
        id: createdDocument.id, title
      }, environment.WAIT_TIME_BEFORE_UPDATE);

      await helper.deleteDocument();

      function setupSubscriptionTest() {
        service.getDocument$(createdDocument.id).subscribe(notifiedDocument => {
          if (notifiedDocument === null) { return; }
          // Check for notification
          if (notifiedDocument.title === title) {
            // received the latest update
            expect().nothing();
            done();
          } // otherwise, continue waiting for more notifications
        });
      }
    }, environment.TIMEOUT_FOR_UPDATE_TEST);

    describe('[RECIPIENT ACCESS]', () => {
      it('should be able to access a document if the user is a recipient', async () => {
        // set the document's ownerId to be different
        input.ownerId = uuidv4();
        // set the recipientEmail
        input.recipientEmail = TEST_USERNAME;

        await helper.sendCreateDocument(input);

        const document = await getFirstDocument();
        expect(document.id).toEqual(input.id);

        await helper.deleteDocument();
      }, environment.TIMEOUT_FOR_UPDATE_TEST);

      it('should NOT be able to access if the user is not the recipient', async () => {
        // set the document's ownerId to be different
        input.ownerId = uuidv4();
        // set the recipientEmail
        input.recipientEmail = 'abcd@gmail.com';

        await helper.sendCreateDocument(input);

        try {
          await getFirstDocument();
          fail('error must occur');
        } catch {
          expect().nothing();
        }

        await helper.deleteDocument();
      });

    });

    describe('[ANONYMOUS ACCESS]', () => {

      it('should be able to access a public document', async () => {
        // set the document sharing to be public
        input.sharingStatus = SharingStatus.PUBLIC;
        await helper.sendCreateDocument(input);

        await Auth.signOut();

        const document = await getFirstDocument();
        expect(document.id).toEqual(input.id);

        await Auth.signIn(TEST_USERNAME, TEST_PASSWORD);

        await helper.deleteDocument();
      }, environment.TIMEOUT_FOR_UPDATE_TEST);

      it('should not be able to access a non-public document', async done => {
        await Auth.signIn(TEST_USERNAME, TEST_PASSWORD);

        if (input.sharingStatus) {
          input.sharingStatus = SharingStatus.PRIVATE;
        }
        await helper.sendCreateDocument(input);

        await Auth.signOut();

        try {
          await getFirstDocument();
          fail('error must be thrown');
        } catch (error) {
          expect(error).toBeTruthy();
        }

        await Auth.signIn(TEST_USERNAME, TEST_PASSWORD);

        await helper.deleteDocument();

        done();
      }, 10000);

    });

    async function getFirstDocument(): Promise<any> {
      return new Promise((resolve, reject) => {
        service.getDocument$(helper.getCreatedDocument().id).subscribe(document => {
          if (document === null) { return; }
          resolve(document);
        }, error => reject(error));
      });
    }

  });

});
