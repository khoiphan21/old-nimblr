import { TestBed } from '@angular/core/testing';

import { BlockFactoryService } from './block-factory.service';

describe('BlockFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlockFactoryService = TestBed.get(BlockFactoryService);
    expect(service).toBeTruthy();
  });
});
