import { TemplateDocument } from './templateDocument';
import { DocumentType, SharingStatus } from 'src/API';

const uuidv4 = require('uuid/v4');

describe('TemplateDocument', () => {
  let document: TemplateDocument;
  let input: any;

  beforeEach(() => {
    input = {
      id: uuidv4(),
      version: uuidv4(),
      type: DocumentType.GENERIC,
      title: 'abc',
      ownerId: uuidv4(),
      editorIds: [],
      viewerIds: [],
      blockIds: [],
      lastUpdatedBy: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sharingStatus: SharingStatus.PUBLIC
    };
  });

  function initiateDocument() {
    document = new TemplateDocument(input);
  }

  describe('constructor()', () => {
    beforeEach(() => {
      initiateDocument();
    });

    it('should create a TemplateDocument', () => {
      expect(document instanceof TemplateDocument).toBe(true);
    });

    it('should have the type of TEMPLATE for whatever given', () => {
      // invalid type
      input.type = 'abcd';
      initiateDocument();
      expect(document.type).toEqual(DocumentType.TEMPLATE);
      // GENERIC
      input.type = DocumentType.GENERIC;
      initiateDocument();
      expect(document.type).toEqual(DocumentType.TEMPLATE);
    });

    describe('submissionDocIds', () => {
      it('should be stored as an empty array if given null', () => {
        input.submissionDocIds = null;
        initiateDocument();
        expect(document.submissionDocIds).toEqual([]);
      });
      it('should be stored as an empty array if given undefined', () => {
        input.submissionDocIds = null;
        initiateDocument();
        expect(document.submissionDocIds).toEqual([]);
      });

      describe('(Immutability Testing)', () => {
        const id = uuidv4();
        it('should store a copy of the given array', () => {
          input.submissionDocIds = [id];
          initiateDocument();
          // now try to add to the original array
          input.submissionDocIds.push(uuidv4());
          // check if the document's array has changed
          expect(document.submissionDocIds).toEqual([id]);
        });
        it('should return only a copy of the stored array', () => {
          input.submissionDocIds = [id];
          initiateDocument();
          document.submissionDocIds.push(uuidv4());
          expect(document.submissionDocIds).toEqual([id]);
        });
      });
    });
  });

});
