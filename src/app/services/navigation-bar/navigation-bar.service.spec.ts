import { TestBed } from '@angular/core/testing';

import { NavigationBarService } from './navigation-bar.service';
import { DocumentService } from '../document/document.service';
import { DocumentImpl } from '../../classes/document-impl';
import { UserImpl } from '../../classes/user-impl';
import { DocumentType } from 'src/app/classes/document';

const sampleUser = new UserImpl('user123', 'test', 'user', 'test@email.com');
describe('NavigationBarService', () => {
  let documentService: DocumentService;
  let service: NavigationBarService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentService
      ]
    });
    documentService = TestBed.get(DocumentService);
    service = TestBed.get(NavigationBarService);
  });

  fit('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('processNavigationTab()', () => {
    const sampleDocument = new DocumentImpl('doc1', DocumentType.GENERIC, 'Test 1', sampleUser, [], [], []);
    const sampleDocument2 = new DocumentImpl('doc2', DocumentType.GENERIC, 'Test 2', sampleUser, [], [], []);

    it('should extract the right details from `Document` object to `NavigationTab`', () => {
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
