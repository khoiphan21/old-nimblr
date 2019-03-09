import { TestBed } from '@angular/core/testing';

import { DocumentCommandService } from './document-command.service';
import { BehaviorSubject } from 'rxjs';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { CreateDocumentInput, DocumentType, UpdateDocumentInput } from '../../../API';
import { deleteDocument } from '../../../graphql/mutations';
import { processTestError } from '../../classes/test-helpers.spec';

const uuidv4 = require('uuid/v4');

describe('DocumentCommandService', () => {
  const service$ = new BehaviorSubject<DocumentCommandService>(null);
  let graphQlService: GraphQLService;
  TestBed.configureTestingModule({});

  let input: CreateDocumentInput;
  let storedDocument: any;

  beforeEach(() => {
    input = {
      type: DocumentType.FORM,
      version: uuidv4(),
      ownerId: uuidv4(),
      lastUpdatedBy: uuidv4()
    };
    graphQlService = TestBed.get(GraphQLService);

  });

  interface RunTestInput {
    input: CreateDocumentInput | UpdateDocumentInput;
    done: any;
    property?: string;
    fullMessage?: string;
  }


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

  it('should be created', () => {
    const service: DocumentCommandService = TestBed.get(DocumentCommandService);
    expect(service).toBeTruthy();
  });

  describe('createDocument for FORM', () => {


    it('should create a form document', done => {
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
    });

    describe('(error pathways)', () => {

      /* tslint:disable:no-string-literal */
      async function runTestWithInput(testInput: RunTestInput): Promise<any> {
        return getService().then(service => {
          // Spyon the internal graphql service
          return service.createDocument(testInput.input as CreateDocumentInput);
        }).then(createdDocument => {
          fail('Should have thrown an error');
          storedDocument = createdDocument;
          return graphQlService.query(deleteDocument, { input: { id: storedDocument.id } });
        }).then(() => {
          testInput.done();
        }).catch(error => {
          const template = `Invalid parameter: Missing argument "${testInput.property}"`;
          const message = testInput.fullMessage ? testInput.fullMessage : template;
          expect(error.message).toEqual(message);
          testInput.done();
        });
      }

      it('should throw an error if the type is undefined', done => {
        delete input.type;
        runTestWithInput({
          input, done,
          fullMessage: 'Invalid parameter: Missing argument "type"'
        });
      });

      it('should throw an error if the type is null', done => {
        input.type = null;
        runTestWithInput({
          input, done,
          fullMessage: 'Invalid parameter: Missing argument "type"'
        });
      });

      it('should throw an error if the version is not a uuid', done => {
        input.version = 'abcde';
        runTestWithInput({
          input, done,
          fullMessage: 'Invalid parameter: version must be an uuid'
        });
      });

      it('should throw an error if the version is undefined', done => {
        delete input.version;
        runTestWithInput({ input, done, property: 'version' });
      });

      it('should throw an error if the version is null', done => {
        input.version = null;
        runTestWithInput({ input, done, property: 'version' });
      });

      it('should throw an error if the title is an empty string', done => {
        input.title = '';
        runTestWithInput({
          input, done,
          fullMessage: 'Invalid parameter: Document title cannot be an empty string'
        });
      });

      it('should throw an error if the ownerId is not a uuid', done => {
        input.ownerId = 'abcde';
        runTestWithInput({
          input, done,
          fullMessage: 'Invalid parameter: ownerId must be an uuid'
        });
      });

      it('should throw an error if the ownerId is undefined', done => {
        delete input.ownerId;
        runTestWithInput({
          input, done, property: 'ownerId'
        });
      });

      it('should throw an error if the ownerId is null', done => {
        input.ownerId = null;
        runTestWithInput({
          input, done, property: 'ownerId'
        });
      });

      it('should throw an error if lastUpdatedBy is not a uuid', done => {
        input.lastUpdatedBy = 'abcde';
        runTestWithInput({
          input, done,
          fullMessage: 'Invalid parameter: lastUpdatedBy must be an uuid'
        });
      });

      it('should throw an error if lastUpdatedBy is undefined', done => {
        delete input.lastUpdatedBy;
        runTestWithInput({
          input, done, property: 'lastUpdatedBy'
        });
      });

      it('should throw an error if lastUpdatedBy is null', done => {
        input.lastUpdatedBy = null;
        runTestWithInput({
          input, done, property: 'lastUpdatedBy'
        });
      });

    });

  });

  describe('updateDocument for FORM', () => {

    it('should register the version to the query service', done => {
      const updatedInput: UpdateDocumentInput = {
        id: uuidv4(),
        title: 'test title',
        version: uuidv4(),
        lastUpdatedBy: uuidv4(),
        updatedAt: new Date().toISOString()
      };
      let service: DocumentCommandService;

      getService().then(readyService => {
        service = readyService;
        spyOn(service['graphQlService'], 'query').and.returnValue(Promise.resolve({
          data: {
            updateDocument: null
          }
        }));
        return service.updateDocument(updatedInput);
      }).then(() => {
        expect(service['queryService']['myVersions'].has(updatedInput.version)).toBe(true);
        done();
      }).catch(error => processTestError(
        'error in testing register version', error, done
      ));
    });

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

    describe('(error pathways)', () => {
      let updatedInput: UpdateDocumentInput;

      /* tslint:disable:no-string-literal */
      async function runTestWithInput(testInput: RunTestInput): Promise<any> {
        return getService().then(service => {
          // Spyon the internal graphql service
          return service.updateDocument(testInput.input as UpdateDocumentInput);
        }).then(createdDocument => {
          fail('Should have thrown an error');
          storedDocument = createdDocument;
          return graphQlService.query(deleteDocument, { input: { id: storedDocument.id } });
        }).then(() => {
          testInput.done();
        }).catch(error => {
          const template = `Invalid parameter: Missing argument "${testInput.property}"`;
          const message = testInput.fullMessage ? testInput.fullMessage : template;
          expect(error.message).toEqual(message);
          testInput.done();
        });
      }

      beforeEach(() => {
        updatedInput = {
          id: uuidv4(),
          title: 'test title',
          version: uuidv4(),
          lastUpdatedBy: uuidv4(),
          updatedAt: new Date().toISOString()
        };
      });

      it('should throw an error if the id is undefined', done => {
        delete updatedInput.id;
        runTestWithInput({
          input: updatedInput, done,
          property: 'id'
        });
      });

      it('should throw an error if the id is null', done => {
        updatedInput.id = null;
        runTestWithInput({
          input: updatedInput, done,
          property: 'id'
        });
      });

      it('should throw an error if the id is not a uuid', done => {
        updatedInput.id = 'abcd';
        runTestWithInput({
          input: updatedInput, done,
          fullMessage: 'Invalid parameter: id must be an uuid'
        });
      });

      it('should throw an error if the version is undefined', done => {
        delete updatedInput.version;
        runTestWithInput({
          input: updatedInput, done,
          property: 'version'
        });
      });

      it('should throw an error if the version is null', done => {
        updatedInput.version = null;
        runTestWithInput({
          input: updatedInput, done,
          property: 'version'
        });
      });

      it('should throw an error if the version is not a uuid', done => {
        updatedInput.version = 'abcd';
        runTestWithInput({
          input: updatedInput, done,
          fullMessage: 'Invalid parameter: version must be an uuid'
        });
      });

      it('should throw an error if the title is an empty string', done => {
        updatedInput.title = '';
        runTestWithInput({
          input: updatedInput, done,
          fullMessage: 'Invalid parameter: Document title cannot be an empty string'
        });
      });

      it('should throw an error if the updatedAt is undefined', done => {
        delete updatedInput.updatedAt;
        runTestWithInput({
          input: updatedInput, done,
          property: 'updatedAt'
        });
      });

      it('should throw an error if the updatedAt is null', done => {
        updatedInput.updatedAt = null;
        runTestWithInput({
          input: updatedInput, done,
          property: 'updatedAt'
        });
      });

      it('should throw an error if the lastUpdatedBy is undefined', done => {
        delete updatedInput.lastUpdatedBy;
        runTestWithInput({
          input: updatedInput, done,
          property: 'lastUpdatedBy'
        });
      });

      it('should throw an error if the lastUpdatedBy is null', done => {
        updatedInput.lastUpdatedBy = null;
        runTestWithInput({
          input: updatedInput, done,
          property: 'lastUpdatedBy'
        });
      });

      it('should throw an error if the lastUpdatedBy is not a uuid', done => {
        updatedInput.lastUpdatedBy = 'abcd';
        runTestWithInput({
          input: updatedInput, done,
          fullMessage: 'Invalid parameter: lastUpdatedBy must be an uuid'
        });
      });
    });

  });
});
