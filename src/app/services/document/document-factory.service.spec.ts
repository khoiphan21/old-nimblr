import { TestBed } from '@angular/core/testing';

import { DocumentFactoryService } from './document-factory.service';
import { isUuid } from '../../classes/helpers';
import { DocumentType } from 'src/API';

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

  describe('(creation logic)', () => {

    describe('with only id and ownerId', () => {
      let document: any;

      beforeEach(() => {
        document = service.createDocument(input);
      });

      it('should create a version', () => {
        expect(isUuid(document.ownerId)).toBe(true);
      });
      it('should set the type', () => {
        expect(document.type).toEqual(DocumentType.GENERIC);
      });
      it('should create an editorIds array', () => {
        expect(document.editorIds.length).toBe(0);
      });
      it('should create a viewerIds array', () => {
        expect(document.viewerIds.length).toBe(0);
      });
      it('should create a blockIds array', () => {
        expect(document.blockIds.length).toBe(0);
      });
      it('should set lastUpdatedBy to ownerId', () => {
        expect(document.lastUpdatedBy).toEqual(input.ownerId);
      });
      it('should set createdAt', () => {
        expect(new Date(document.createdAt) instanceof Date).toBe(true);
      });
      it('should set updatedAt', () => {
        expect(new Date(document.updatedAt) instanceof Date).toBe(true);
      });
    });

    it('should store the id', () => {
      const document = service.createDocument(input);
      expect(document.id).toEqual(input.id);
    });

    it('should store the ownerId', () => {
      const document = service.createDocument(input);
      expect(document.ownerId).toEqual(input.ownerId);
    });

    it('should store the title', () => {
      input.title = 'test title';
      const document = service.createDocument(input);
      expect(document.title).toEqual(input.title);
    });

    it('should store the version if given', () => {
      input.version = uuidv4();
      const document = service.createDocument(input);
      expect(document.version).toEqual(input.version);
    });

    it('should store the type if given', () => {
      input.type = DocumentType.FORM;
      const document = service.createDocument(input);
      expect(document.type).toEqual(input.type);
    });

    it('should store the editorIds if given', () => {
      input.editorIds = [uuidv4()];
      const document = service.createDocument(input);
      expect(document.editorIds[0]).toEqual(input.editorIds[0]);
    });

    it('should store the viewerIds if given', () => {
      input.viewerIds = [uuidv4()];
      const document = service.createDocument(input);
      expect(document.viewerIds[0]).toEqual(input.viewerIds[0]);
    });

    it('should store the blockIds if given', () => {
      input.blockIds = [uuidv4()];
      const document = service.createDocument(input);
      expect(document.blockIds[0]).toEqual(input.blockIds[0]);
    });

    it('should store the lastUpdatedBy if given', () => {
      input.lastUpdatedBy = uuidv4();
      const document = service.createDocument(input);
      expect(document.lastUpdatedBy).toEqual(input.lastUpdatedBy);
    });

    it('should store the createdAt if given', () => {
      input.createdAt = new Date().toISOString();
      const document = service.createDocument(input);
      expect(document.createdAt).toEqual(input.createdAt);
    });

    it('should store the updatedAt if given', () => {
      input.updatedAt = new Date().toISOString();
      const document = service.createDocument(input);
      expect(document.updatedAt).toEqual(input.updatedAt);
    });

  });

  describe('(parameter checking)', () => {
    const requiredUuidParams = [
      'id', 'ownerId'
    ];

    requiredUuidParams.forEach(param => {
      it(`${param} should throw an error if null or undefined`, () => {
        testForNullOrUndefined(param);
      });
    });

    requiredUuidParams.forEach(param => {
      it(`${param} should throw an error if not a uuid`, () => {
        testIfUuid(param);
      });
    });

    function testForNullOrUndefined(param: string) {
      const errorMessage = `Invalid parameter: missing ${param}`;
      // Test for undefined
      try {
        delete input[param];
        service.createDocument(input);
        fail('error should occur');
      } catch (error) {
        expect(error.message).toEqual(errorMessage);
      }
      // Test for null
      try {
        input[param] = null;
        service.createDocument(input);
        fail('error should occur');
      } catch (error) {
        expect(error.message).toEqual(errorMessage);
      }
    }

    function testIfUuid(param: string) {
      const errorMessage = `Invalid parameter: ${param} must be a uuid`;

      try {
        input[param] = 'abcd';
        service.createDocument(input);
        fail('error should occur');
      } catch (error) {
        expect(error.message).toEqual(errorMessage);
      }
    }
  });
});
