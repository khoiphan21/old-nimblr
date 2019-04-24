import { SendDocumentCommand } from './sendDocumentCommand';
import { BehaviorSubject, Subject } from 'rxjs';

// tslint:disable:no-string-literal
fdescribe('SendDocumentCommand', () => {
  let input: any;
  let command: SendDocumentCommand;

  beforeEach(() => {
    input = {
      blockCommandService: { duplicateBlocks: () => { } },
      blockQueryService: { getBlock$: () => { } },
      documentCommandService: { foo2: 'bar2' },
      documentQueryService: { getDocument$: () => { } },
      documentFactoryService: { foo4: 'bar4' },
      emailService: { foo5: 'bar5' }
    };
    command = new SendDocumentCommand(input);
  });

  describe('constructor()', () => {

    describe('storing given services', () => {
      [
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

    let duplicateBlockSpy: jasmine.Spy;

    beforeEach(async () => {
      documentId = '1234';
      email = 'test@email.com';
      blockIds = ['blockId1', 'blockId2'];

      duplicateBlockSpy = spyOn<any>(command, 'duplicateBlocksFor');
      duplicateBlockSpy.and.returnValue(Promise.resolve(blockIds));

      await command.execute(documentId, email);
    });

    it('should call duplicateBlocksFor() with the right id', () => {
      expect(duplicateBlockSpy).toHaveBeenCalledWith(documentId);
    });
  });

  describe('duplicateBlocksFor()', () => {
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
      await command['duplicateBlocksFor'](docId);
    });

    it('should call to getBlocks with the right id', () => {
      expect(getBlockSpy).toHaveBeenCalledWith(docId);
    });
    it('should call to duplicate the retrieved blocks', () => {
      expect(duplicateBlockSpy).toHaveBeenCalledWith(mockBlocks);
    });
  });

  describe('getBlocks()', () => {
    let mockBlock: any;
    let mockBlockId1: string;
    let mockBlockId2: string;
    let mockDocId: string;

    let blocks: any;

    let firstDocSpy: jasmine.Spy;
    let currentBlockSpy: jasmine.Spy;

    beforeEach(async () => {
      // mock data
      mockBlock = { foo: 'bar' };
      mockBlockId1 = '1234';
      mockBlockId2 = '5678';
      mockDocId = 'docId';

      // setup spies
      // getFirstDocument()
      firstDocSpy = spyOn<any>(command, 'getFirstDocument');
      firstDocSpy.and.returnValue(Promise.resolve({
        blockIds: [mockBlockId1, mockBlockId2]
      }));
      // getCurrentBlock()
      currentBlockSpy = spyOn<any>(command, 'getCurrentBlock');
      currentBlockSpy.and.returnValue(Promise.resolve(mockBlock));

      // now call the method
      blocks = await command['getBlocks'](mockDocId);
    });

    it('should return the array of blocks from the services', async () => {
      expect(blocks).toEqual([mockBlock, mockBlock]);
    });

    it('should call getFirstDocument with the right id', () => {
      expect(firstDocSpy).toHaveBeenCalledWith(mockDocId);
    });

    it('should call getCurrentBlock for each id in document', () => {
      const calls = currentBlockSpy.calls.all();
      expect('first id: ' + calls[0].args[0]).toEqual('first id: ' + mockBlockId1);
      expect('second id: ' + calls[1].args[0]).toEqual('second id: ' + mockBlockId2);
    });
  });

  describe('getFirstDocument()', () => {
    let documentId: string;
    let mockDocument: any;
    let document: any;

    // spies
    let docQuerySpy: jasmine.Spy;

    beforeEach(async () => {
      // Mock data
      documentId = '1234';
      mockDocument = { foo: 'bar' };
      const document$ = new BehaviorSubject(mockDocument);

      // Setup spies
      // DocumentQueryService
      docQuerySpy = spyOn(command['documentQueryService'], 'getDocument$');
      docQuerySpy.and.returnValue(document$);

    });

    describe('happy pathway', () => {

      beforeEach(async () => {
        // Call the method
        document = await command['getFirstDocument'](documentId);
      });

      it('should call the spy with the right id', () => {
        expect(docQuerySpy).toHaveBeenCalledWith(documentId);
      });
      it('should resolve with the first document retrieved', async () => {
        expect(document).toEqual(mockDocument);
      });

    });

    describe('error pathway', () => {
      it('should reject with an error from the service', done => {
        const error$ = new Subject();
        const error = new Error('getDocument error');
        docQuerySpy.and.returnValue(error$);

        // now call the method
        command['getFirstDocument'](documentId).catch(err => {
          expect(err.message).toEqual(error.message);
          done();
        });

        // emit the error
        error$.error(error);
      });
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
});
