import { DocumentQueryTestHelper } from './helper';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Auth } from 'aws-amplify';
import { CreateDocumentInput, DocumentType, SharingStatus } from '../../../API';
import { processTestError } from 'src/app/classes/test-helpers.spec';
import { TEST_USERNAME, TEST_PASSWORD } from '../loginHelper';

const uuidv4 = require('uuid/v4');

describe('DocumentQueryTestHelper', () => {
  const helper$ = new BehaviorSubject<DocumentQueryTestHelper>(null);
  TestBed.configureTestingModule({});

  beforeAll(() => {
    Auth.signIn(TEST_USERNAME, TEST_PASSWORD).then(() => {
      helper$.next(new DocumentQueryTestHelper(TestBed.get(GraphQLService)));
    }, error => helper$.error(error));
  });

  it('should create, update and delete a document', done => {
    helper$.subscribe(helper => {
      if (helper === null) { return; }
      let createdId: string;
      const input: CreateDocumentInput = {
        id: uuidv4(),
        version: uuidv4(),
        ownerId: uuidv4(),
        lastUpdatedBy: uuidv4(),
        sharingStatus: SharingStatus.PRIVATE,
        type: DocumentType.GENERIC
      };
      const testTitle = 'Updated title (testing Helper)';
      helper.sendCreateDocument(input).then(createdDocument => {
        createdId = createdDocument.id;
        expect(createdDocument).toBeTruthy();
        expect(helper.getCreatedDocument()).toBeTruthy();
        // now attempt to update the document
        return helper.sendUpdateDocument({
          id: createdId,
          title: testTitle
        });
      }).then(updatedResponse => {
        expect(updatedResponse).toBeTruthy();
        expect(updatedResponse.id).toEqual(createdId);
        expect(updatedResponse.title).toEqual(testTitle);

        // now delete the document
        return helper.deleteDocument();
      }).then(deletedResponse => {
        expect(deletedResponse).toBeTruthy();
        expect(deletedResponse.id).toEqual(createdId);
        done();
      }).catch(error => processTestError('error creating document', error, done));
    }, error => processTestError('unable to get helper', error, done));
  });


});
