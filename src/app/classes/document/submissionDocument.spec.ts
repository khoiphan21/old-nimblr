import { SubmissionDocument } from './submissionDocument';
import { DocumentType, SharingStatus, SubmissionStatus } from 'src/API';

const uuidv4 = require('uuid/v4');

const BASE_ERROR_MESSAGE = 'SubmissionDocument failed to create: ';

describe('SubmissionDocument', () => {
  let document: SubmissionDocument;
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
    initiateDocument();
  });

  function initiateDocument() {
    document = new SubmissionDocument(input);
  }

  describe('type', () => {
    it('should have the type of SUBMISSION no matter what is given', () => {
      input.type = 'abcd';
      initiateDocument();
      expect(document.type).toEqual(DocumentType.SUBMISSION);
      input.type = DocumentType.GENERIC;
      initiateDocument();
      expect(document.type).toEqual(DocumentType.SUBMISSION);
    });
  });

  describe('recipientEmail', () => {
    it('should store the email value', () => {
      const value = 'test@email.com';
      input.recipientEmail = value;
      initiateDocument();
      expect(document.recipientEmail).toEqual(value);
    });
    it('should be set to empty string if given null', () => {
      input.recipientEmail = null;
      initiateDocument();
      expect(document.recipientEmail).toEqual('');
    });
    it('should be set to empty string if given undefined', () => {
      input.recipientEmail = undefined;
      initiateDocument();
      expect(document.recipientEmail).toEqual('');
    });
  });

  describe('submittedAt', () => {
    it('should throw an error if not a valid date string', () => {
      try {
        input.submittedAt = 'abcd';
        new SubmissionDocument(input);
        fail('error must occur');
      } catch (error) {
        const message = 'submittedAt must be a valid date string';
        expect(error.message).toEqual(BASE_ERROR_MESSAGE + message);
      }
    });
    it('should store the given date string', () => {
      const value = new Date().toISOString();
      input.submittedAt = value;
      initiateDocument();
      expect(document.submittedAt).toEqual(value);
    });
    it('should store as null if value is undefined', () => {
      input.submittedAt = undefined;
      initiateDocument();
      expect(document.submittedAt).toBe(null);
    });
    it('should still store as null if value is null', () => {
      input.submittedAt = null;
      initiateDocument();
      expect(document.submittedAt).toBe(null);
    });
  });

  describe('submissionStatus', () => {
    it('should store as NOT_STARTED if given *invalid* value', () => {
      input.submissionStatus = 'abcd';
      initiateDocument();
      expect(document.submissionStatus).toEqual(SubmissionStatus.NOT_STARTED);
    });
    it('should store as NOT_STARTED if given *null*', () => {
      input.submissionStatus = null;
      initiateDocument();
      expect(document.submissionStatus).toEqual(SubmissionStatus.NOT_STARTED);
    });
    it('should store as NOT_STARTED if given *undefined*', () => {
      input.submissionStatus = undefined;
      initiateDocument();
      expect(document.submissionStatus).toEqual(SubmissionStatus.NOT_STARTED);
    });
    it('should store the given value', () => {
      // NOT_STARTED
      input.submissionStatus = SubmissionStatus.NOT_STARTED;
      initiateDocument();
      expect(document.submissionStatus).toEqual(SubmissionStatus.NOT_STARTED);
      // IN_PROGRESS
      input.submissionStatus = SubmissionStatus.IN_PROGRESS;
      initiateDocument();
      expect(document.submissionStatus).toEqual(SubmissionStatus.IN_PROGRESS);
      // SUBMITTED
      input.submissionStatus = SubmissionStatus.IN_PROGRESS;
      initiateDocument();
      expect(document.submissionStatus).toEqual(SubmissionStatus.IN_PROGRESS);
    });
  });
});
