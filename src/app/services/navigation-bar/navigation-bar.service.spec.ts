import { TestBed, async } from '@angular/core/testing';

import { NavigationBarService } from './navigation-bar.service';
import { DocumentService } from '../document/document.service';
import { AccountService } from '../account/account.service';
import { ServicesModule } from '../../modules/services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentFactoryService } from '../document/factory/document-factory.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { configureTestSuite } from 'ng-bullet';
import { BlockFactoryService } from '../block/factory/block-factory.service';
import { DocumentStructureTab } from 'src/app/classes/navigation-tab';

const uuidv4 = require('uuid/v4');

describe('NavigationBarService', () => {
  let accountService: AccountService;
  let documentService: DocumentService;
  let service: NavigationBarService;
  let documentFactory: DocumentFactoryService;
  let blockFactory: BlockFactoryService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [ServicesModule, RouterTestingModule.withRoutes([])]
    });
  });
  beforeEach(() => {
    accountService = TestBed.get(AccountService);
    documentService = TestBed.get(DocumentService);
    documentFactory = TestBed.get(DocumentFactoryService);
    blockFactory = TestBed.get(BlockFactoryService);
    service = TestBed.get(NavigationBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNavigationBarStatus$', () => {
    it('should have an observable of Navigation Bar Status', () => {
      expect(service.getNavigationBarStatus$() instanceof BehaviorSubject).toBe(
        true
      );
    });

    it('should receive the right value from the observable', done => {
      service
        .getNavigationBarStatus$()
        .pipe(skip(1))
        .subscribe(value => {
          expect(value).toBe(true);
          done();
        });
      service.setNavigationBarStatus(true);
    });
  });

  /* tslint:disable:no-string-literal */
  describe('getNavigationBar$', () => {
    let getAllSpy: jasmine.Spy;

    const documentId = uuidv4();

    beforeEach(() => {
      // setup spies
      getAllSpy = spyOn<any>(service, 'getAllUserDocuments');
    });

    it('should have an observable of Navigation Tabs', () => {
      const navigationBar$ = service.getNavigationBar$();
      expect(navigationBar$ instanceof BehaviorSubject).toBe(true);
    });

    it('should return an initial value of an empty array', done => {
      service
        .getNavigationBar$()
        .pipe(take(1))
        .subscribe(value => {
          expect(value).toEqual([]);
          done();
        });
    });
  });

  describe('getNavigationBar$ helpers', () => {
    let document$: Subject<any>;
    const document = { foo: 'bar' };
    let getUserDocumentsSpy: jasmine.Spy;
    let getDocumentSpy: jasmine.Spy;
    beforeEach(() => {
      // Setup the navigation bar observable in the service
      service['navigationBar$'] = new BehaviorSubject([]);
      // setup mock data for testing
      document$ = new Subject();
      getUserDocumentsSpy = spyOn(
        service['documentService'],
        'getUserDocuments$'
      ).and.returnValue(document$);
      getDocumentSpy = spyOn(
        service['documentQueryService'],
        'getDocument$'
      ).and.returnValue(document$);
    });

    describe('getAllUserDocuments()', () => {
      let processSpy: jasmine.Spy;

      beforeEach(() => {
        processSpy = spyOn(service, 'processNavigationTab');
      });

      it('should call to process with the right argument', done => {
        service['getAllUserDocuments']().then(() => {
          expect(processSpy).toHaveBeenCalledWith(document);
          done();
        });
        document$.next(document);
      });

      it('should emit the processed navigation tabs', done => {
        const processedDocs = [document];
        processSpy.and.returnValue(processedDocs);
        service['getAllUserDocuments']().then(() => {
          expect(service['navigationBar$'].getValue() as any).toEqual(
            processedDocs
          );
          done();
        });
        document$.next(document);
      });

      it('should emit the error if unable to get documents', done => {
        const errMessage = 'test';
        service['getAllUserDocuments']().catch(() => {
          try {
            service['navigationBar$'].getValue();
          } catch (error) {
            expect(error).toEqual(errMessage);
            done();
          }
        });
        document$.error(errMessage);
      });
    });

    describe('getForDocument()', () => {
      let processSpy: jasmine.Spy;

      beforeEach(() => {
        processSpy = spyOn<any>(service, 'processDocuments');
      });

      it('should call to process with the right argument', done => {
        service['getForDocument']('').then(() => {
          expect(processSpy).toHaveBeenCalledWith([document]);
          done();
        });
        document$.next(document);
      });

      it('should emit any error given', done => {
        const errMessage = 'test';

        service['getForDocument']('').catch(() => {
          try {
            service['navigationBar$'].getValue();
          } catch (error) {
            expect(error).toEqual(errMessage);
            done();
          }
        });
        document$.error(errMessage);
      });
    });
  });

  describe('processNavigationTab()', () => {
    it('should extract the right details from `Document` object to `NavigationTab`', () => {
      const sampleDocument = documentFactory.convertRawDocument({
        id: uuidv4(),
        ownerId: uuidv4(),
        title: 'Test title'
      });
      const sampleDocument2 = documentFactory.convertRawDocument({
        id: uuidv4(),
        ownerId: uuidv4(),
        title: 'Test title'
      });
      const sampleDocuments = [sampleDocument, sampleDocument2];
      const processedDatas = service.processNavigationTab(sampleDocuments);
      expect(processedDatas.length).toBe(2);
      processedDatas.forEach((data, index) => {
        expect(data.id).toEqual(sampleDocuments[index].id);
        expect(data.title).toEqual(sampleDocuments[index].title);
      });
    });
  });

  /* tslint:disable:no-string-literal */
  describe('getDocumentStructure$', () => {
    let getTabsSpy: jasmine.Spy;
    const documentId = uuidv4();

    beforeEach(() => {
      // setup spies
      getTabsSpy = spyOn<any>(service, 'getTabsForDocument');
    });

    it('should have an observable of Navigation Tabs', () => {
      const navigationBar$ = service.getDocumentStructure$(documentId);
      expect(navigationBar$ instanceof BehaviorSubject).toBe(true);
    });

    it('should return an initial value of an empty array', done => {
      service.getDocumentStructure$(documentId)
        .pipe(take(1))
        .subscribe(value => {
          expect(value).toEqual([]);
          done();
        });
    });
  });

  describe('getTabsForDocument()', () => {
    let getDocumentSpy: jasmine.Spy;
    let getBlocksSpy: jasmine.Spy;
    let processDocumentStructureSpy: jasmine.Spy;
    let blocks = [];
    let headerBlock;
    let headerId;
    let headerBlock2;
    let headerId2;
    const documentId = uuidv4();
    beforeEach(() => {
      // setup variables
      service['documentStructure$'] = new BehaviorSubject<Array<DocumentStructureTab>>(null);
      const textBlock = blockFactory.createNewTextBlock({
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });
      headerBlock = blockFactory.createNewHeaderBlock({
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });
      headerBlock2 = blockFactory.createNewHeaderBlock({
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });
      blocks = [ textBlock, headerBlock, headerBlock2];
      // setup spies
      getDocumentSpy = spyOn(service['documentQueryService'], 'getDocument$');
      getDocumentSpy.and.returnValue(new BehaviorSubject(null));
      getBlocksSpy = spyOn(service['blockQueryService'], 'getBlocksForDocument');
      getBlocksSpy.and.returnValue(Promise.resolve(blocks));
      processDocumentStructureSpy = spyOn<any>(service, 'processDocumentStructure');
    });

    it('should call getDocument$() with the right argument', async () => {
      await service['getTabsForDocument'](documentId);
      expect(getDocumentSpy).toHaveBeenCalledWith(documentId);
    });

    it('should call getBlocksForDocument$() with the right argument', async () => {
      await service['getTabsForDocument'](documentId);
      expect(getBlocksSpy).toHaveBeenCalledWith(documentId);
    });

    it('should call processDocumentStructure$() with the right argument', async () => {
      await service['getTabsForDocument'](documentId);
      expect(processDocumentStructureSpy).toHaveBeenCalledWith(blocks);
    });

    it('should emit the correct value to the observable', async (done) => {
      await service['getTabsForDocument'](documentId);
      const processedData = service['processDocumentStructure'](blocks);
      service['documentStructure$'].subscribe((value) => {
        expect(value).toEqual(processedData);
        done();
      });
    });

    describe('processDocuentStructure()', () => {
      let processedDatas;

      beforeEach(() => {
        headerId = headerBlock.id;
        headerId2 = headerBlock2.id;
        processDocumentStructureSpy.and.callThrough();
        processedDatas = service['processDocumentStructure'](blocks);
      });

      it('should only extract HeaderBlocks from the blocks', () => {
        expect(processedDatas.length).toBe(2);
      });

      it('should extract the right details from `block` object to `documentStructureTab`', () => {
        const data = processedDatas.filter((block: any) => {
          return block.id === headerId || block.id === headerId2;
        });
        expect(processedDatas.length).toBe(2);
      });
    });

  });

});
