import { DocumentImpl } from './document-impl';
import { DocumentType, SharingStatus } from 'src/API';
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

});
