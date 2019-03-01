import { TestBed } from '@angular/core/testing';

import { DocumentCommandService } from './document-command.service';

describe('DocumentCommandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentCommandService = TestBed.get(DocumentCommandService);
    expect(service).toBeTruthy();
  });
});
