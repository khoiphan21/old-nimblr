import { SendDocumentCommand } from './sendDocumentCommand';
import { BehaviorSubject, Subject } from 'rxjs';

// tslint:disable:no-string-literal
fdescribe('SendDocumentCommand', () => {
  let input: any;
  let command: SendDocumentCommand;

  beforeEach(() => {
    input = {
      accountService: { getUser$: () => { } },
      blockCommandService: { duplicateBlocks: () => { } },
      blockQueryService: { getBlock$: () => { } },
      documentCommandService: { createDocument: () => { } },
      documentQueryService: { getDocument$: () => { } },
      documentFactoryService: { createNewSubmission: () => { } },
      emailService: { foo5: 'bar5' }
    };
    command = new SendDocumentCommand(input);
  });

  describe('constructor()', () => {

    describe('storing given services', () => {
      [
        'accountService',
        'blockCommandService',
        'blockQueryService',
        'documentCommandService',
        'documentQueryService',
        'documentFactoryService',
        'emailService'
      ].forEach(property => {
        it(`should store the ${property}`, () => {
          expect(command[property]).toEqual(input[property]);
        });
      });
    });

  });

  describe('execute()', () => {
    let documentId: string;
    let email: string;
    let blockIds: Array<string>;

    let getDocumentSpy: jasmine.Spy;
    let duplicateBlockSpy: jasmine.Spy;
    let createSubmissionSpy: jasmine.Spy;
    let createDocumentSpy: jasmine.Spy;

    beforeEach(async () => {
      documentId = '1234';
      email = 'test@email.com';
      blockIds = ['blockId1', 'blockId2'];

      // setup spies
      // getDocument()
      getDocumentSpy = spyOn<any>(command, 'getDocument');
      getDocumentSpy.and.returnValue(Promise.resolve());
      // duplicateBlock()
      duplicateBlockSpy = spyOn<any>(command, 'duplicateBlocks');
      duplicateBlockSpy.and.returnValue(Promise.resolve(blockIds));
      // createSubmission()
      createSubmissionSpy = spyOn<any>(command, 'createSubmission');
      createSubmissionSpy.and.returnValue(Promise.resolve());
      // createDocumentInGraphQL()
      createDocumentSpy = spyOn<any>(command, 'createDocumentInGraphQL');
      createDocumentSpy.and.returnValue(Promise.resolve());

      await command.execute(documentId, email);
    });

    it('should store the email given', () => {
      expect(command['email']).toEqual(email);
    });

    it('should call getDocument() with the id', () => {
      expect(getDocumentSpy).toHaveBeenCalledWith(documentId);
    });

    it('should call duplicateBlocks() with the right id', () => {
      expect(duplicateBlockSpy).toHaveBeenCalled();
    });

    it('should call to createSubmission()', () => {
      expect(createSubmissionSpy).toHaveBeenCalled();
    });

    it('should call to createDocumentInGraphQL()', () => {
      expect(createDocumentSpy).toHaveBeenCalled();
    });
  });

  describe('getDocument()', () => {
    let documentId: string;
    let mockDocument: any;

    // spies
    let docQuerySpy: jasmine.Spy;

    beforeEach(async () => {
      // Mock data
      documentId = '1234';
      mockDocument = { foo: 'bar' };
      const document$ = new BehaviorSubject(mockDocument);

      // Setup spies
      docQuerySpy = spyOn(command['documentQueryService'], 'getDocument$');
      docQuerySpy.and.returnValue(document$);
    });

    describe('happy pathway', () => {

      beforeEach(async () => {
        // Call the method
        await command['getDocument'](documentId);
      });

      it('should call the spy with the right id', () => {
        expect(docQuerySpy).toHaveBeenCalledWith(documentId);
      });
      it('should store the retrieved document', () => {
        expect(command['document']).toEqual(mockDocument);
      });

    });

    describe('error pathway', () => {
      it('should reject with an error from the service', done => {
        const error$ = new Subject();
        const error = new Error('getDocument error');
        docQuerySpy.and.returnValue(error$);

        // now call the method
        command['getDocument'](documentId).catch(err => {
          expect(err.message).toEqual(error.message);
          done();
        });

        // emit the error
        error$.error(error);
      });
    });
  });

  describe('duplicateBlocks()', () => {
    let docId: any;
    let mockBlocks: Array<any>;

    // spies
    let getBlockSpy: jasmine.Spy;
    let duplicateBlockSpy: jasmine.Spy;

    beforeEach(async () => {
      // mock data
      docId = 'docId';
      mockBlocks = [
        { id: 'blockId123' }
      ];

      // setup spies
      // getBlocks()
      getBlockSpy = spyOn<any>(command, 'getBlocks');
      getBlockSpy.and.returnValue(Promise.resolve(mockBlocks));
      // duplicateBlock()
      duplicateBlockSpy = spyOn(command['blockCommandService'], 'duplicateBlocks');
      duplicateBlockSpy.and.returnValue(Promise.resolve(mockBlocks));

      // call the method
      await command['duplicateBlocks']();
    });

    it('should call to getBlocks with the right id', () => {
      expect(getBlockSpy).toHaveBeenCalled();
    });
    it('should call to duplicate the retrieved blocks', () => {
      expect(duplicateBlockSpy).toHaveBeenCalledWith(mockBlocks);
    });
    it('should store the duplicated block ids', () => {
      const expected = mockBlocks.map(block => block.id);
      expect(command['duplicatedBlockIds']).toEqual(expected);
    });
  });

  describe('getBlocks()', () => {
    let mockDocument: any;
    let mockBlock: any;
    let mockBlockId1: string;
    let mockBlockId2: string;
    let mockDocId: string;

    let blocks: any;

    let currentBlockSpy: jasmine.Spy;

    beforeEach(async () => {
      // mock data
      mockBlock = { foo: 'bar' };
      mockBlockId1 = '1234';
      mockBlockId2 = '5678';
      mockDocId = 'docId';
      mockDocument = {
        blockIds: [mockBlockId1, mockBlockId2]
      };
      command['document'] = mockDocument;

      // setup spies
      // getCurrentBlock()
      currentBlockSpy = spyOn<any>(command, 'getCurrentBlock');
      currentBlockSpy.and.returnValue(Promise.resolve(mockBlock));

      // now call the method
      blocks = await command['getBlocks']();
    });

    it('should return the array of blocks from the services', async () => {
      expect(blocks).toEqual([mockBlock, mockBlock]);
    });

    it('should call getCurrentBlock for each id in document', () => {
      const calls = currentBlockSpy.calls.all();
      expect('first id: ' + calls[0].args[0]).toEqual('first id: ' + mockBlockId1);
      expect('second id: ' + calls[1].args[0]).toEqual('second id: ' + mockBlockId2);
    });
  });

  describe('getCurrentBlock()', () => {
    let blockId: string;
    let mockBlock: any;
    let block: any;

    // spies
    let blockQuerySpy: jasmine.Spy;

    beforeEach(async () => {
      // Mock data
      blockId = '1234';
      mockBlock = { foo: 'bar' };
      const block$ = new BehaviorSubject(mockBlock);

      // Setup spies
      // DocumentQueryService
      blockQuerySpy = spyOn(command['blockQueryService'], 'getBlock$');
      blockQuerySpy.and.returnValue(block$);
    });

    describe('happy pathway', () => {

      beforeEach(async () => {
        // Call the method
        block = await command['getCurrentBlock'](blockId);
      });

      it('should call the spy with the right id', () => {
        expect(blockQuerySpy).toHaveBeenCalledWith(blockId);
      });
      it('should resolve with the first document retrieved', async () => {
        expect(block).toEqual(mockBlock);
      });

    });

    describe('error pathway', () => {
      it('should reject with an error from the service', done => {
        const error$ = new Subject();
        const error = new Error('getDocument error');
        blockQuerySpy.and.returnValue(error$);

        // now call the method
        command['getCurrentBlock'](blockId).catch(err => {
          expect(err.message).toEqual(error.message);
          done();
        });

        // emit the error
        error$.error(error);
      });
    });
  });

  describe('createSubmission()', () => {
    const document: any = { title: 'test title' };
    const duplicatedBlockIds = ['block-1234'];
    const id = 'user-abcd';
    const email = 'test@email.com';
    const submission = { foo: 'bar' };

    let accountSpy: jasmine.Spy;
    let submissionSpy: jasmine.Spy;

    beforeEach(async () => {
      // setup mock properties
      command['email'] = email;
      command['document'] = document;
      command['duplicatedBlockIds'] = duplicatedBlockIds;

      accountSpy = spyOn(command['accountService'], 'getUser$');
      accountSpy.and.returnValue(new BehaviorSubject({ id }));
      // createNewSubmission()
      submissionSpy = spyOn(command['documentFactoryService'], 'createNewSubmission');
      submissionSpy.and.returnValue(submission);

      // call the method
      await command['createSubmission']();
    });

    it('should call docFactory with the right arguments', () => {
      const expectedArg = {
        ownerId: id,
        recipientEmail: email,
        blockIds: duplicatedBlockIds,
        title: document.title
      };
      expect(submissionSpy).toHaveBeenCalledWith(expectedArg);
    });

    it('should store the document created by docFactory', () => {
      expect(command['submission'] as any).toEqual(submission);
    });
  });

  describe('createDocumentInGraphQL()', () => {
    let spy: jasmine.Spy;
    const mockSubmission: any = { foo: 'bar' };

    beforeEach(() => {
      // mock data
      command['submission'] = mockSubmission;

      spy = spyOn(command['documentCommandService'], 'createDocument');
      spy.and.returnValue(Promise.resolve());

    });

    it('should call to create with the right arg', async () => {
      await command['createDocumentInGraphQL']();
      expect(spy).toHaveBeenCalledWith(mockSubmission);
    });

    it('should throw the error from backend', async () => {
      const mockError = new Error('failed to create');
      spy.and.returnValue(Promise.reject(mockError));
      try {
        await command['createDocumentInGraphQL']();
        fail('error must occur');
      } catch (error) {
        expect(error).toEqual(mockError);
      }
    });
  });
});
