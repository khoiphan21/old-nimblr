import { DocumentQueryTestHelper } from './helper';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { CreateDocumentInput, DocumentType } from '../../../API';
import { processTestError } from 'src/app/classes/helpers';

fdescribe('DocumentQueryTestHelper', () => {
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
        type: DocumentType.FORM
      };
      const testTitle = 'Updated title (testing Helper)';
      helper.sendCreateDocument(input).then(response => {
        createdId = response.data.createDocument.id;
        expect(response.data.createDocument).toBeTruthy();
        // now attempt to update the document
        return helper.sendUpdateDocument({
          id: createdId,
          title: testTitle
        });
      }).then(updatedResponse => {
        expect(updatedResponse.data.updateDocument).toBeTruthy();
        expect(updatedResponse.data.updateDocument.id).toEqual(createdId);
        expect(updatedResponse.data.updateDocument.title).toEqual(testTitle);

        // now delete the document
        return helper.deleteDocument();
      }).then(deletedResponse => {
        expect(deletedResponse.data.deleteDocument).toBeTruthy();
        expect(deletedResponse.data.deleteDocument.id).toEqual(createdId);
        done();
      }).catch(error => processTestError('error creating document', error, done));
    }, error => processTestError('unable to get helper', error, done) );
  });

  
});
