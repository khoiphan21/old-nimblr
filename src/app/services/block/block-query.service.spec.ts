import { TestBed } from '@angular/core/testing';

import { BlockQueryService } from './block-query.service';

describe('BlockQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlockQueryService = TestBed.get(BlockQueryService);
    expect(service).toBeTruthy();
  });
});
