import { TestBed } from '@angular/core/testing';

import { DocumentCommandService } from './document-command.service';
import { CreateDocumentInput, DocumentType, UpdateDocumentInput, SharingStatus, DeleteDocumentInput } from '../../../../API';
import { createDocument } from 'src/graphql/mutations';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentFactoryService } from '../factory/document-factory.service';

const uuidv4 = require('uuid/v4');
interface RunTestInput {
  input: CreateDocumentInput | UpdateDocumentInput;
  done: any;
  property?: string;
  fullMessage?: string;
}

describe('DocumentCommandService', () => {

  let service: DocumentCommandService;
  let factory: DocumentFactoryService;
  let querySpy: jasmine.Spy;
  let input: any;

  /* tslint:disable:no-string-literal */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    });
    input = {
      type: DocumentType.GENERIC,
      version: uuidv4(),
      ownerId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      sharingStatus: SharingStatus.PRIVATE
    };
    service = TestBed.get(DocumentCommandService);
    factory = TestBed.get(DocumentFactoryService);
    // setup graphQlService to return some results
    querySpy = spyOn(service['graphQlService'], 'query');
    querySpy.and.returnValue(Promise.resolve({
      data: { createDocument: null }
    }));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createDocument', () => {

    it('should change the title to null if given empty string', () => {
      input.title = '';
      service.createDocument(input);
      expect(querySpy.calls.mostRecent().args[1].input.title).toBe(null);
    });

    describe('(checking GraphQlService.query arguments)', () => {
      it('should call with the right query', () => {
        service.createDocument(input);
        expect(querySpy.calls.mostRecent().args[0]).toEqual(createDocument);
      });

      it('should call with the right argument', () => {
        service.createDocument(input);
        // Extract the arguments to check
        const {
          type, version, ownerId, lastUpdatedBy, sharingStatus
        } = querySpy.calls.mostRecent().args[1].input;
        // Form a new argument
        const argsToCheck = {
          type, version, ownerId, lastUpdatedBy, sharingStatus
        };

        expect(argsToCheck).toEqual(input);
      });

      describe('when called with a Document instance', () => {
        it('should not have unnecessary properties', () => {
          const document = factory.createNewDocument({
            ownerId: uuidv4(),
          });
          service.createDocument(document);

          // Check an example of a non-relevant property
          const arg = querySpy.calls.mostRecent().args[1].input;
          expect(arg.baseErrorMessage).toBeUndefined();
        });
      });
    });

    describe('[SUCCESS]', () => {
      it('should resolve the document return by backend', done => {
        const testValue = { foo: 'bar' };
        querySpy.and.returnValue(Promise.resolve({
          data: { createDocument: testValue }
        }));
        // now call the service
        service.createDocument(input).then(document => {
          expect(document).toEqual(testValue);
          done();
        });
      });
    });

    describe('(error pathways)', () => {

      async function runTestWithInput(testInput: RunTestInput) {
        service.createDocument(testInput.input as CreateDocumentInput).then(() => {
          fail('Should have thrown an error');
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

      it('should throw an error if sharingStatus is undefined', done => {
        delete input.sharingStatus;
        runTestWithInput({
          input, done, property: 'sharingStatus'
        });
      });

      it('should throw an error if sharingStatus is null', done => {
        input.sharingStatus = null;
        runTestWithInput({
          input, done, property: 'sharingStatus'
        });
      });

    });

  });

  describe('updateDocument()', () => {

    /* tslint:disable:no-string-literal */
    describe('[SUCCESS]', () => {
      const version = uuidv4();
      const lastUpdatedBy = uuidv4();
      const updatedAt = new Date().toISOString();
      const updatedInput: UpdateDocumentInput = {
        id: uuidv4(),
        title: 'test title',
        version,
        lastUpdatedBy,
        updatedAt,
        createdAt: new Date().toISOString()
      };

      beforeEach(() => {
        querySpy.and.returnValue(Promise.resolve({
          data: { updateDocument: null }
        }));
      });

      it('should use a new version', async () => {
        service.updateDocument(updatedInput);
        expect(querySpy.calls.mostRecent().args[1].input.version).not.toEqual(version);
      });

      it('should use a new updatedAt', async () => {
        await sleep(); // to make sure at least a few millisecs have passed
        await service.updateDocument(updatedInput);

        async function sleep() {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve();
            }, 3);
          });
        }

        expect(querySpy.calls.mostRecent().args[1].input.updatedAt).not.toEqual(updatedAt);
      });

      it('should not update createdAt', async () => {
        await service.updateDocument(updatedInput);

        expect(querySpy.calls.mostRecent().args[1].input.createdAt).toBe(undefined);
      });

      it('should call the VersionService to store the version', () => {
        service.updateDocument(updatedInput);
        const v = querySpy.calls.mostRecent().args[1].input.version;
        expect(service['versionService']['myVersions'].has(v)).toBe(true);
      });

      it('should return the updated document', async () => {
        const testValue = { foo: 'bar' };
        querySpy.and.returnValue(Promise.resolve({
          data: { updateDocument: testValue }
        }));
        // now call the service
        const document = await service.updateDocument(updatedInput);
        expect(document).toEqual(testValue);
      });

      it('should convert empty string title into null', async () => {
        updatedInput.title = '';
        await service.updateDocument(updatedInput);
        expect(querySpy.calls.mostRecent().args[1].input.title).toBe(null);
      });

    });

    describe('[ERROR]', () => {
      let updatedInput: UpdateDocumentInput;

      /* tslint:disable:no-string-literal */
      async function runTestWithInput(testInput: RunTestInput): Promise<any> {
        service.updateDocument(testInput.input as UpdateDocumentInput).then(() => {
          fail('Should have thrown an error');
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

  fdescribe('deleteDocument()', () => {
    // TODO: @bruno impl
    let input: DeleteDocumentInput;

    beforeEach(() => {
      input = { id: 'testid' };
      querySpy.and.returnValue(Promise.resolve({
        data: { deleteDocument: null }
      }));
    });

    it('should execute the document deletion query', done => {
      service.deleteDocument(input).then(() => {
        expect(querySpy.calls.count()).toBe(1);
        done();
      });
    });

    it('should execute the document deletion with expected input', done => {
      const expectedInput = { input };
      service.deleteDocument(input).then(() => {
        expect(querySpy.calls.mostRecent().args[1]).toEqual(expectedInput);
        done();
      });
    });

    it('should throw expected error when query failed', done => {
      const errMsg = 'test err';
      querySpy.and.returnValue(Promise.reject(new Error(errMsg)));
      service.deleteDocument(input).catch(err => {
        expect(err.message).toEqual(errMsg);
        done();
      });
    });

  });
});
