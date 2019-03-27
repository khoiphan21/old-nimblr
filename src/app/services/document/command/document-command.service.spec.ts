import { TestBed } from '@angular/core/testing';

import { DocumentCommandService } from './document-command.service';
import { CreateDocumentInput, DocumentType, UpdateDocumentInput, SharingStatus } from '../../../../API';
import { processTestError } from '../../../classes/test-helpers.spec';
import { createDocument } from 'src/graphql/mutations';

const uuidv4 = require('uuid/v4');
interface RunTestInput {
  input: CreateDocumentInput | UpdateDocumentInput;
  done: any;
  property?: string;
  fullMessage?: string;
}

describe('DocumentCommandService', () => {

  let service: DocumentCommandService;
  let querySpy: jasmine.Spy;
  let input: CreateDocumentInput;

  /* tslint:disable:no-string-literal */
  beforeEach(() => {
    TestBed.configureTestingModule({});
    input = {
      type: DocumentType.GENERIC,
      version: uuidv4(),
      ownerId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      sharingStatus: SharingStatus.PRIVATE
    };
    service = TestBed.get(DocumentCommandService);
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
        expect(querySpy.calls.mostRecent().args[1]).toEqual({ input });
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

  describe('updateDocument', () => {

    /* tslint:disable:no-string-literal */
    describe('[SUCCESS]', () => {
      const updatedInput: UpdateDocumentInput = {
        id: uuidv4(),
        title: 'test title',
        version: uuidv4(),
        lastUpdatedBy: uuidv4(),
        updatedAt: new Date().toISOString()
      };

      it('should register the version to the query service', done => {
        querySpy.and.returnValue(Promise.resolve({
          data: { updateDocument: null }
        }));

        service.updateDocument(updatedInput).then(() => {
          expect(service['queryService']['myVersions'].has(updatedInput.version)).toBe(true);
          done();
        }).catch(error => processTestError(
          'error in testing register version', error, done
        ));
      });

      it('should return the updated document', done => {
        const testValue = { foo: 'bar' };
        querySpy.and.returnValue(Promise.resolve({
          data: { updateDocument: testValue }
        }));
        // now call the service
        service.updateDocument(updatedInput).then(document => {
          expect(document).toEqual(testValue);
          done();
        });
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
