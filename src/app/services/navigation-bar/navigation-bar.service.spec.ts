import { TestBed } from '@angular/core/testing';

import { NavigationBarService } from './navigation-bar.service';
import { DocumentService } from '../document/document.service';
import { AccountService } from '../account/account.service';
import { ServicesModule } from '../../modules/services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentFactoryService } from '../document/factory/document-factory.service';
import { BehaviorSubject } from 'rxjs';
import { skip } from 'rxjs/operators';
import { configureTestSuite } from 'ng-bullet';

const uuidv4 = require('uuid/v4');

fdescribe('NavigationBarService', () => {
  let accountService: AccountService;
  let documentService: DocumentService;
  let service: NavigationBarService;
  let documentFactory: DocumentFactoryService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([])
      ]
    });
  });
  beforeEach(() => {
    accountService = TestBed.get(AccountService);
    documentService = TestBed.get(DocumentService);
    documentFactory = TestBed.get(DocumentFactoryService);
    service = TestBed.get(NavigationBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNavigationBarStatus$', () => {

    it('should have an observable of Navigation Bar Status', () => {
      expect(service.getNavigationBarStatus$() instanceof BehaviorSubject).toBe(true);
    });

    it('should receive the right value from the observable', done => {
      service.getNavigationBarStatus$().pipe(skip(1)).subscribe(value => {
        expect(value).toBe(true);
        done();
      });
      service.setNavigationBarStatus(true);
    });
  });

  /* tslint:disable:no-string-literal */
  describe('getNavigationBar$', () => {
    let getUserDocumentsSpy: jasmine.Spy;
    let backendSubject: BehaviorSubject<any>;

    beforeEach(() => {
      // spy on the document service
      backendSubject = new BehaviorSubject([]);
      getUserDocumentsSpy = spyOn(service['documentService'], 'getUserDocuments$');
      getUserDocumentsSpy.and.returnValue(backendSubject);
    });

    it('should have an observable of Navigation Tabs', () => {
      expect(service.getNavigationBar$() instanceof BehaviorSubject).toBe(true);
    });

    it('should process the documents into navigation tabs when data arrived', () => {
      spyOn(service, 'processNavigationTab').and.returnValue([]);
      service.getNavigationBar$();
      expect(service.processNavigationTab).toHaveBeenCalled();
    });

    describe('(User not logged in)', () => {

      it('should get for the one document only', done => {
        const spy = spyOn<any>(service, 'getForDocument');
        service.getNavigationBar$();
        backendSubject.error('error');
        setTimeout(() => {
          expect(spy).toHaveBeenCalled();
          done();
        }, 5);
      });

    });
  });

  describe('getForDocument()', () => {

  });

  describe('processNavigationTab()', () => {
    it('should extract the right details from `Document` object to `NavigationTab`', () => {
      const sampleDocument = documentFactory.createDocument({
        id: uuidv4(),
        ownerId: uuidv4(),
        title: 'Test title'
      });
      const sampleDocument2 = documentFactory.createDocument({
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
});
