import { TestBed } from '@angular/core/testing';

import { DocumentFactoryService } from './document-factory.service';

describe('DocumentFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentFactoryService = TestBed.get(DocumentFactoryService);
    expect(service).toBeTruthy();
  });
});
