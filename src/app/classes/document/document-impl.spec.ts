import { DocumentImpl } from './document-impl';
import { DocumentType, SharingStatus, SubmissionStatus } from 'src/API';
import { isValidDateString } from '../isValidDateString';
import { isUuid } from '../helpers';

const uuidv4 = require('uuid/v4');

const BASE_ERROR_MESSAGE = 'DocumentImpl failed to create: ';

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

  describe('id', () => {
    testForUuidType('id');
  });

  function testForUuidType(propertyName) {
    const checkIfUuid = true;

    testStoreGivenValue(propertyName, uuidv4());

    testDefaultValueIfNullOrUndefined({
      propertyName,
      expectedValueDescription: 'a valid uuid',
      checkIfUuid
    });

    testInvalidValue({
      propertyName,
      value: 'abcd',
      message: `"${propertyName}" must be a valid uuid`,
      givenValueDescription: 'an invalid uuid'
    });
  }

  function testStoreGivenValue(propertyName: string, value: any) {
    it('should store the given value', () => {
      input[propertyName] = value;

      initiateDocument();

      expect(document[propertyName]).toEqual(value);
    });
  }

  function testDefaultValueIfNullOrUndefined(testInput: TestDefaultValueInput) {
    [null, undefined].forEach(value => {
      const testName = `should be set to ${
        testInput.expectedValueDescription
        } if ${value === undefined ? 'undefined' : 'null'}`;

      it(testName, () => {
        input[testInput.propertyName] = value;

        initiateDocument();

        if (testInput.expectedValue !== undefined) {
          expect(document[testInput.propertyName]).toEqual(testInput.expectedValue);
          return;
        }
        if (testInput.checkIfUuid) {
          expect(isUuid(document[testInput.propertyName])).toBe(true);
          return;
        }
        if (testInput.checkIfDateString) {
          expect(isValidDateString(document[testInput.propertyName])).toBe(true);
          return;
        }

        throw new Error('must set at least one value of: expectedValue, checkIfUuid or checkIfDateString');
      });

    });
  }

  interface TestDefaultValueInput {
    propertyName: string;
    expectedValueDescription: string;
    expectedValue?: any;
    checkIfUuid?: boolean;
    checkIfDateString?: boolean;
  }

  function testInvalidValue({
    propertyName, value, message, givenValueDescription
  }) {
    it(`should throw an error if given ${givenValueDescription}`, () => {
      try {
        input[propertyName] = value;
        initiateDocument();
        fail('error must occur');
      } catch (error) {
        expect(error.message).toEqual(BASE_ERROR_MESSAGE + message);
      }
    });
  }

  describe('version', () => {
    testForUuidType('version');
  });

  describe('type', () => {
    const propertyName = 'type';

    testStoringValueForEnum(propertyName, DocumentType);

    testDefaultValueIfNullOrUndefined({
      propertyName,
      expectedValueDescription: 'the value of GENERIC',
      expectedValue: DocumentType.GENERIC
    });

    testInvalidValue({
      propertyName,
      value: 'abcd',
      message: '"type" must be a valid value of DocumentType',
      givenValueDescription: 'an invalid DocumentType'
    });
  });

  function testStoringValueForEnum(propertyName, enumType) {
    Object.keys(enumType).forEach(value => {
      testStoreGivenValue(propertyName, value);
    });
  }

  describe('title', () => {
    const propertyName = 'title';

    testStoreGivenValue(propertyName, 'abcd');

    testDefaultValueIfNullOrUndefined({
      propertyName,
      expectedValueDescription: 'an empty string',
      expectedValue: ''
    });

    testInvalidValue({
      propertyName,
      value: 2,
      message: 'title must be a string',
      givenValueDescription: 'an non-string value'
    });
  });

  describe('ownerId', () => {
    testForUuidType('ownerId');
  });

  describe('editorIds', () => {
    testForUuidArrayType('editorIds');
  });

  function testForUuidArrayType(propertyName: string) {
    testStoreGivenValue(propertyName, [uuidv4()]);

    testDefaultValueIfNullOrUndefined({
      propertyName,
      expectedValueDescription: 'a valid uuid',
      expectedValue: []
    });

    testInvalidValue({
      propertyName,
      value: 'abcd',
      message: `"${propertyName}" must be an array`,
      givenValueDescription: 'an invalid array'
    });

    testInvalidValue({
      propertyName,
      value: [uuidv4(), 'abcd'],
      message: `"${propertyName}" must contain only UUIDs`,
      givenValueDescription: 'an array containing a non-uuid value'
    });
  }

  describe('viewerIds', () => {
    testForUuidArrayType('viewerIds');
  });

  describe('blockIds', () => {
    testForUuidArrayType('blockIds');
  });

  describe('lastUpdatedBy', () => {
    testForUuidType('lastUpdatedBy');
  });

  describe('createdAt', () => {
    testForDateStringType('createdAt');
  });

  function testForDateStringType(propertyName) {
    testStoreGivenValue(propertyName, new Date().toISOString());

    testDefaultValueIfNullOrUndefined({
      propertyName,
      expectedValueDescription: 'a valid date string',
      checkIfDateString: true
    });

    testInvalidValue({
      propertyName,
      value: 'abcd',
      message: `"${propertyName}" must be a valid date string`,
      givenValueDescription: 'an invalid date string'
    });
  }

  describe('updatedAt', () => {
    testForDateStringType('updatedAt');
  });

  describe('sharingStatus', () => {
    const propertyName = 'sharingStatus';

    testStoringValueForEnum(propertyName, SharingStatus);

    testDefaultValueIfNullOrUndefined({
      propertyName,
      expectedValueDescription: 'the value PRIVATE',
      expectedValue: SharingStatus.PRIVATE
    });

    testInvalidValue({
      propertyName,
      value: 'abcd',
      message: `"${propertyName}" must be a valid value of SharingStatus`,
      givenValueDescription: 'an invalid date string'
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
