import { SendDocumentCommand } from './sendDocumentCommand';
import { BehaviorSubject, Subject } from 'rxjs';

// tslint:disable:no-string-literal
fdescribe('SendDocumentCommand', () => {
  let input: any;
  let command: SendDocumentCommand;

  // mock data for testing
  const testError = new Error('test error from sendDocumentCommand');
  const mockUser = {
    id: 'user-1234'
  };

  // spies
  let getUserSpy: jasmine.Spy;

  beforeEach(() => {
    resetCommand();

    // Setting up spies
    // getCurrentUser()
    getUserSpy = spyOn<any>(command, 'getCurrentUser');
    getUserSpy.and.returnValue(Promise.resolve(mockUser));

  });

  function resetCommand() {
    input = {
      accountService: { getUser$: () => { } },
      blockCommandService: { duplicateBlocks: () => { } },
      blockQueryService: { getBlock$: () => { } },
      documentCommandService: {
        createDocument: () => { },
        updateDocument: () => { }
      },
      documentQueryService: { getDocument$: () => { } },
      documentFactoryService: { createNewSubmission: () => { } },
      emailService: { sendInvitationEmail: () => { } }
    };
    command = new SendDocumentCommand(input);
  }

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
    let mockSubmission: any;
    let returnValue: any;

    let getDocumentSpy: jasmine.Spy;
    let duplicateBlockSpy: jasmine.Spy;
    let createSubmissionSpy: jasmine.Spy;
    let createDocumentSpy: jasmine.Spy;
    let updateDocumentSpy: jasmine.Spy;
    let sendEmailSpy: jasmine.Spy;

    beforeEach(async () => {
      documentId = '1234';
      email = 'test@email.com';
      blockIds = ['blockId1', 'blockId2'];
      mockSubmission = {
        id: 'submission-1234'
      };

      // setup mock data of the command
      command['submission'] = mockSubmission;

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
      // updateTemplateDocument()
      updateDocumentSpy = spyOn<any>(command, 'updateTemplateDocument');
      updateDocumentSpy.and.returnValue(Promise.resolve());
      // sendEmail()
      sendEmailSpy = spyOn<any>(command, 'sendEmail');
      sendEmailSpy.and.returnValue(Promise.resolve());

      returnValue = await command.execute(documentId, email);
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

    it('should call to update the template document', () => {
      expect(updateDocumentSpy).toHaveBeenCalled();
    });

    it('should call to send the email', () => {
      expect(sendEmailSpy).toHaveBeenCalled();
    });

    it('should return the id of the submission', () => {
      expect(returnValue).toEqual(mockSubmission.id);
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
    const email = 'test@email.com';
    const submission = { foo: 'bar' };

    let submissionSpy: jasmine.Spy;

    beforeEach(async () => {
      // setup mock properties
      command['email'] = email;
      command['document'] = document;
      command['duplicatedBlockIds'] = duplicatedBlockIds;

      // createNewSubmission()
      submissionSpy = spyOn(command['documentFactoryService'], 'createNewSubmission');
      submissionSpy.and.returnValue(submission);

      // call the method
      await command['createSubmission']();
    });

    it('should call docFactory with the right arguments', () => {
      const expectedArg = {
        ownerId: mockUser.id,
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

  describe('getCurrentUser()', () => {
    let spy: jasmine.Spy;

    beforeEach(() => {
      resetCommand(); // this is needed as getCurrentUser() is spied on
      spy = spyOn(command['accountService'], 'getUser$');
    });

    it('should resolve with the user', async () => {
      spy.and.returnValue(new BehaviorSubject(mockUser));
      const returnValue: any = await command['getCurrentUser']();
      expect(returnValue).toEqual(mockUser);
    });

    it('should reject if error', done => {
      const observable$ = new Subject();
      spy.and.returnValue(observable$);
      command['getCurrentUser']().then(fail).catch(error => {
        expect(error).toEqual(testError);
        done();
      });
      observable$.error(testError);
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

  describe('updateTemplateDocument()', () => {
    let mockDocument: any;
    const mockSubmission: any = {
      id: 'submission-id'
    };

    let commandSpy: jasmine.Spy;

    beforeEach(() => {
      mockDocument = {
        id: 'doc-id',
        submissionDocIds: []
      };

      command['document'] = mockDocument;
      command['submission'] = mockSubmission;

      // setup spies
      commandSpy = spyOn(command['documentCommandService'], 'updateDocument');
    });

    it('should call to update document with the right args', async () => {
      await command['updateTemplateDocument']();
      const expectedArg = {
        id: mockDocument.id,
        submissionDocIds: [mockSubmission.id],
        lastUpdatedBy: mockUser.id
      };
      expect(commandSpy).toHaveBeenCalledWith(expectedArg);
    });

    it('should reject with the error from backend', done => {
      commandSpy.and.returnValue(Promise.reject(testError));
      command['updateTemplateDocument']().catch(error => {
        expect(error).toEqual(testError);
        done();
      });
    });
  });

  describe('sendEmail()', () => {
    const email = 'email@test.com';
    const mockSubmission: any = {
      id: 'submission-id'
    };

    let emailSpy: jasmine.Spy;

    beforeEach(() => {
      command['email'] = email;
      command['submission'] = mockSubmission;

      // setup spies
      emailSpy = spyOn(command['emailService'], 'sendInvitationEmail');
    });

    it('should call sendInvitationEmail() with the right arg', async () => {
      await command['sendEmail']();
      const expectedArg = {
        email,
        documentId: mockSubmission.id,
        sender: mockUser
      };
      expect(emailSpy).toHaveBeenCalledWith(expectedArg);
    });

    it('should reject the error from backend', done => {
      emailSpy.and.returnValue(Promise.reject(testError));
      command['sendEmail']().catch(error => {
        expect(error).toEqual(testError);
        done();
      });
    });
  });
});
