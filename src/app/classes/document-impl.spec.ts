import { DocumentImpl } from './document-impl';
import { DocumentType, SharingStatus, SubmissionStatus } from 'src/API';
import { isValidDateString } from './isValidDateString';

const uuidv4 = require('uuid/v4');

describe('DocumentImpl', () => {
  let document: DocumentImpl;
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
    document = new DocumentImpl(input);
  }

  describe('undefined parameters', () => {
    it('should set editorIds to an empty array if undefined', () => {
      delete input.editorIds;
      initiateDocument();
      expect(document.editorIds.length).toEqual(0);
    });
    it('should set viewerIds to an empty array if undefined', () => {
      delete input.viewerIds;
      initiateDocument();
      expect(document.viewerIds.length).toEqual(0);
    });
    it('should set blockIds to an empty array if undefined', () => {
      delete input.blockIds;
      initiateDocument();
      expect(document.blockIds.length).toEqual(0);
    });
    it('should set createdAt to a date if undefined', () => {
      delete input.createdAt;
      initiateDocument();
      expect(isValidDateString(document.createdAt)).toBe(true);
    });
    it('should set updatedAt to a date if undefined', () => {
      delete input.updatedAt;
      initiateDocument();
      expect(isValidDateString(document.updatedAt)).toBe(true);
    });
    it('should set sharingStatus to null if undefined', () => {
      delete input.sharingStatus;
      initiateDocument();
      expect(document.sharingStatus).toBe(null);
    });
  });

  describe('null parameters', () => {
    it('should set editorIds to an empty array if undefined', () => {
      input.editorIds = null;
      initiateDocument();
      expect(document.editorIds.length).toEqual(0);
    });
    it('should set viewerIds to an empty array if undefined', () => {
      input.viewerIds = null;
      initiateDocument();
      expect(document.viewerIds.length).toEqual(0);
    });
    it('should set blockIds to an empty array if undefined', () => {
      input.blockIds = null;
      initiateDocument();
      expect(document.blockIds.length).toEqual(0);
    });
    it('should set createdAt to a date if undefined', () => {
      input.createdAt = null;
      initiateDocument();
      expect(isValidDateString(document.createdAt)).toBe(true);
    });
    it('should set updatedAt to a date if undefined', () => {
      input.updatedAt = null;
      initiateDocument();
      expect(isValidDateString(document.updatedAt)).toBe(true);
    });
  });

  describe('TEMPLATE properties', () => {
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

  /* tslint:disable:no-unused-expression */
  describe('Submission Details properties', () => {

    describe('checking isSubmission flag', () => {
      let validateSpy: jasmine.Spy;
      beforeEach(() => {
        validateSpy = spyOn<any>(DocumentImpl.prototype, 'validateSubmissionProperties');
      });
      it('should call this function if isSubmission is true', () => {
        input.isSubmission = true;
        initiateDocument();
        expect(validateSpy).toHaveBeenCalled();
      });
      it('should NOT  call this function if isSubmission is false', () => {
        input.isSubmission = false;
        initiateDocument();
        expect(validateSpy).not.toHaveBeenCalled();
      });
      it('should NOT call this function if isSubmission is null', () => {
        input.isSubmission = null;
        initiateDocument();
        expect(validateSpy).not.toHaveBeenCalled();
      });
      it('should NOT call this function if isSubmission is undefined', () => {
        input.isSubmission = undefined;
        initiateDocument();
        expect(validateSpy).not.toHaveBeenCalled();
      });
    });

    describe('isSubmission', () => {
      it('should be stored with the given value', () => {
        input.isSubmission = true;
        initiateDocument();
        expect(document.isSubmission).toBe(true);
        input.isSubmission = false;
        initiateDocument();
        expect(document.isSubmission).toBe(false);
      });
      it('should be stored as "false" if given null or undefined', () => {
        input.isSubmission = null;
        initiateDocument();
        expect(document.isSubmission).toBe(false);
        input.isSubmission = undefined;
        initiateDocument();
        expect(document.isSubmission).toBe(false);
      });
    });

    describe('when isSubmission is true', () => {
      beforeEach(() => {
        input.isSubmission = true;
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
            new DocumentImpl(input);
            fail('error must occur');
          } catch (error) {
            const BASE_ERROR_MESSAGE = 'DocumentImpl failed to create: ';
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
  });

});
