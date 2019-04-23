import { TestBed } from '@angular/core/testing';

import { DocumentCommandService } from './document-command.service';
import { GraphQLService } from '../../graphQL/graph-ql.service';
import { CreateDocumentInput, DocumentType, UpdateDocumentInput, SharingStatus, DeleteDocumentInput } from '../../../../API';
import { deleteDocument } from '../../../../graphql/mutations';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { LoginHelper } from '../../loginHelper';

const uuidv4 = require('uuid/v4');

describe('(Integration) DocumentCommandService', () => {
  let service: DocumentCommandService;
  let graphQlService: GraphQLService;

  let input: CreateDocumentInput;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    });
  });

  beforeEach(() => {
    input = {
      type: DocumentType.GENERIC,
      version: uuidv4(),
      ownerId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      sharingStatus: SharingStatus.PRIVATE
    };
    service = TestBed.get(DocumentCommandService);
    graphQlService = TestBed.get(GraphQLService);
  });

  beforeAll(async () => {
    await LoginHelper.login();
  });

  describe('createDocument', () => {

    it('should create a GENERIC document', async () => {
      const createdDocument = await service.createDocument(input);
      expect(createdDocument).toBeTruthy();

      // Now delete it
      const deletedDocument = await graphQlService.query(
        deleteDocument, { input: { id: createdDocument.id } }
      );
      expect(deletedDocument.data.deleteDocument.id).toEqual(createdDocument.id);
    });

  });

  describe('updateDocument', () => {

    it('should update a document with new values', async () => {
      const updatedInput: UpdateDocumentInput = {
        id: null,
        title: 'test title',
        version: uuidv4(),
        lastUpdatedBy: uuidv4()
      };

      const createdDocument = await service.createDocument(input);
      // update the input
      updatedInput.id = createdDocument.id;
      const updatedDocument = await service.updateDocument(updatedInput);
      expect(`id: ${updatedDocument.id}`).toEqual(`id: ${updatedInput.id}`);
      expect(`title: ${updatedDocument.title}`).toEqual(`title: ${updatedInput.title}`);
      expect(`version: ${updatedDocument.version}`).toEqual(`version: ${updatedInput.version}`);
      expect(`lastUpdatedBy: ${updatedDocument.lastUpdatedBy}`).toEqual(`lastUpdatedBy: ${updatedInput.lastUpdatedBy}`);

      // Delete it
      await graphQlService.query(deleteDocument, { input: { id: createdDocument.id } });
    });

  });

  describe('deleteDocument', () => {
    let deleteInput: DeleteDocumentInput;

    it('should delete a specific document', async () => {
      const testId = 'test123';

      // create a document with these parameters
      input.id = testId;
      const creationResponse = await service.createDocument(input);
      expect(creationResponse).toBeTruthy();

      // QUESTION: as far as i can see in previous integration tests, we implemented the 
      // actual deletion function on graphql to test things. But after the deletion is done, 
      // they call an be replaced by this function. My question is, would it be quicker and easier
      // if we implemnet all these CRUD functions before writing any integration test or even before
      // we actually need these functions. We know that we need a 'deletion' function anyways.
      // So we dont have to waste time writing the implmentation in integration tests?

      // delete this document
      deleteInput = {
        id: testId
      };
      const deletionResponse = await service.deleteDocument(deleteInput);

      // check whether document exist
      expect(deletionResponse).toBeTruthy();
    });

  });
});
