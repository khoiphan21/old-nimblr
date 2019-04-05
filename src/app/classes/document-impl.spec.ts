import { DocumentImpl } from './document-impl';
import { DocumentType, SharingStatus } from 'src/API';
import { isValidDateString } from './isValidDateString';

const uuidv4 = require('uuid/v4');

describe('DocumentImpl', () => {
  let document: DocumentImpl;
  let argument: any;

  beforeEach(() => {
    argument = {
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

  describe('undefined parameters', () => {
    it('should set editorIds to an empty array if undefined', () => {
      delete argument.editorIds;
      document = new DocumentImpl(argument);
      expect(document.editorIds.length).toEqual(0);
    });
    it('should set viewerIds to an empty array if undefined', () => {
      delete argument.viewerIds;
      document = new DocumentImpl(argument);
      expect(document.viewerIds.length).toEqual(0);
    });
    it('should set blockIds to an empty array if undefined', () => {
      delete argument.blockIds;
      document = new DocumentImpl(argument);
      expect(document.blockIds.length).toEqual(0);
    });
    it('should set createdAt to a date if undefined', () => {
      delete argument.createdAt;
      document = new DocumentImpl(argument);
      expect(isValidDateString(document.createdAt)).toBe(true);
    });
    it('should set updatedAt to a date if undefined', () => {
      delete argument.updatedAt;
      document = new DocumentImpl(argument);
      expect(isValidDateString(document.updatedAt)).toBe(true);
    });
    it('should set sharingStatus to null if undefined', () => {
      delete argument.sharingStatus;
      document = new DocumentImpl(argument);
      expect(document.sharingStatus).toBe(null);
    });
  });

  describe('null parameters', () => {
    it('should set editorIds to an empty array if undefined', () => {
      argument.editorIds = null;
      document = new DocumentImpl(argument);
      expect(document.editorIds.length).toEqual(0);
    });
    it('should set viewerIds to an empty array if undefined', () => {
      argument.viewerIds = null;
      document = new DocumentImpl(argument);
      expect(document.viewerIds.length).toEqual(0);
    });
    it('should set blockIds to an empty array if undefined', () => {
      argument.blockIds = null;
      document = new DocumentImpl(argument);
      expect(document.blockIds.length).toEqual(0);
    });
    it('should set createdAt to a date if undefined', () => {
      argument.createdAt = null;
      document = new DocumentImpl(argument);
      expect(isValidDateString(document.createdAt)).toBe(true);
    });
    it('should set updatedAt to a date if undefined', () => {
      argument.updatedAt = null;
      document = new DocumentImpl(argument);
      expect(isValidDateString(document.updatedAt)).toBe(true);
    });
  });

});
