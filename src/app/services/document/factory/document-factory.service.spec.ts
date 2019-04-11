import { TestBed } from '@angular/core/testing';

import { DocumentFactoryService, NewDocumentInput } from './document-factory.service';
import { isUuid } from '../../../classes/helpers';
import { DocumentType, SharingStatus, SubmissionStatus } from 'src/API';
import { Document } from 'src/app/classes/document/document';
import { DocumentImpl } from 'src/app/classes/document/document-impl';
import { TemplateDocument } from 'src/app/classes/document/templateDocument';
import { SubmissionDocument } from 'src/app/classes/document/submissionDocument';

const uuidv4 = require('uuid/v4');

describe('DocumentFactoryService', () => {
  let service: DocumentFactoryService;
  let input: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(DocumentFactoryService);
    input = {
      id: uuidv4(),
      ownerId: uuidv4()
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createNewDocument()', () => {
    let document: Document;
    input = input as NewDocumentInput;

    beforeEach(() => {
      input = {
        ownerId: uuidv4()
      };
      document = service.createNewDocument(input);
    });

    it('should return a Document object', () => {
      expect(document instanceof DocumentImpl).toBe(true);
    });

    it('should have the default type to be GENERIC', () => {
      expect(document.type).toEqual(DocumentType.GENERIC);
    });

    it('should store the given ownerId', () => {
      expect(document.ownerId).toEqual(input.ownerId);
    });

    it('should automatically set the lastUpdatedBy as the ownerId', () => {
      expect(document.lastUpdatedBy).toEqual(input.ownerId);
    });

    // no need to check for errors as the DocumentImpl will do the validation
  });

  describe('createNewTemplateDocument()', () => {
    let document: Document;

    beforeEach(() => {
      input = {
        ownerId: uuidv4()
      };
      document = service.createNewTemplateDocument(input);
    });

    it('should return a TemplateDocument object', () => {
      expect(document instanceof TemplateDocument).toBe(true);
    });
    it('should have the type TEMPLATE', () => {
      expect(document.type).toEqual(DocumentType.TEMPLATE);
    });
    it('should have the right ownerId', () => {
      expect(document.ownerId).toEqual(input.ownerId);
    });
    it('should store the lastUpdatedBy from the given ownerId', () => {
      expect(document.lastUpdatedBy).toEqual(input.ownerId);
    });

    // no need to check for errors as the DocumentImpl will do the validation
  });

  describe('convertRawDocument()', () => {
    let document: Document;

    function checkPropertyInitialisation() {
      it('created document should have initialised all properties', () => {
        Object.getOwnPropertyNames(document).forEach(property => {
          expect(document[property]).toBeDefined();
        });
      });
    }

    describe('with only "type" defined', () => {
      describe('GENERIC', () => {
        runTestForType(DocumentType.GENERIC);
      });
      describe('TEMPLATE', () => {
        runTestForType(DocumentType.TEMPLATE);
      });
      describe('SUBMISSION', () => {
        runTestForType(DocumentType.SUBMISSION);
      });

      function runTestForType(type: DocumentType) {
        beforeEach(() => {
          input = { type };
          document = service.convertRawDocument(input);
        });
        switch (type) {
          case DocumentType.GENERIC:
            checkInstanceType(DocumentImpl);
            break;
          case DocumentType.TEMPLATE:
            checkInstanceType(TemplateDocument);
            break;
          case DocumentType.SUBMISSION:
            checkInstanceType(SubmissionDocument);
            break;
        }
        checkPropertyInitialisation();
        checkDocumentType(type);
      }

      function checkInstanceType(type) {
        it(`should create an instance of ${type.name}`, () => {
          expect(document instanceof type).toBe(true);
        });
      }

      function checkDocumentType(type: DocumentType) {
        it(`should create a document with type ${type}`, () => {
          expect(document.type).toEqual(type);
        });
      }

    });

    describe('with all arguments defined (valid values)', () => {
      beforeEach(() => {
        input = {
          id: uuidv4(),
          version: uuidv4(),
          type: undefined,
          ownerId: uuidv4(),
          lastUpdatedBy: uuidv4(),
          sharingStatus: SharingStatus.PUBLIC,
          title: 'abcd',
          editorIds: [uuidv4()],
          viewerIds: [uuidv4()],
          blockIds: [uuidv4(), uuidv4()],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          submissionDocIds: [uuidv4()],
          recipientEmail: 'abcd@mail.com',
          submittedAt: new Date().toISOString(),
          submissionStatus: SubmissionStatus.SUBMITTED
        };
      });
      describe('with "type" not defined', () => {
        it('should create a GENERIC document', () => {
          input = {};
          document = service.convertRawDocument(input);
          expect(document.type).toEqual(DocumentType.GENERIC);
          Object.getOwnPropertyNames(document).forEach(property => {
            expect(document[property]).toBeDefined();
          });
        });
        it('should store all given values', () => {
          document = service.convertRawDocument(input);
          input.type = DocumentType.GENERIC; // for comparison step
          checkPropertyValues();
        });
      });
      it('GENERIC - should store all given values', () => {
        runTestFor(DocumentType.GENERIC);
      });
      it('TEMPLATE - should store all given values', () => {
        runTestFor(DocumentType.TEMPLATE);
      });
      it('SUBMISSION - should store all given values', () => {
        runTestFor(DocumentType.SUBMISSION);
      });

      function runTestFor(type: DocumentType) {
        input.type = type;
        document = service.convertRawDocument(input);
        checkPropertyValues();
      }

      function checkPropertyValues() {
        Object.getOwnPropertyNames(document).forEach(property => {
          if (property.indexOf('_') === 0) {
            // This is a private property with a getter. Check it.
            const getterName = property.split('_')[1];
            expect(document[getterName]).toEqual(input[getterName]);
          }
        });
      }
    });

    // No need to check for error values as the classes will handle them.
  });

});
