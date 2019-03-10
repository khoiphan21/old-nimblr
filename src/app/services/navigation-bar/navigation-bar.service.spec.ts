import { TestBed } from '@angular/core/testing';

import { NavigationBarService } from './navigation-bar.service';
import { DocumentService } from '../document/document.service';
import { AccountService } from '../account/account.service';
import { ServicesModule } from '../../modules/services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentFactoryService } from '../document/factory/document-factory.service';

const uuidv4 = require('uuid/v4');

describe('NavigationBarService', () => {
  let accountService: AccountService;
  let documentService: DocumentService;
  let service: NavigationBarService;
  let documentFactory: DocumentFactoryService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([])
      ]
    });
    accountService = TestBed.get(AccountService);
    documentService = TestBed.get(DocumentService);
    documentFactory = TestBed.get(DocumentFactoryService);
    service = TestBed.get(NavigationBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNavigationBar$', () => {

    it('should have an observable of Navigation Tabs', () => {
      expect(service.getNavigationBar$()).toBeTruthy();
    });

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
