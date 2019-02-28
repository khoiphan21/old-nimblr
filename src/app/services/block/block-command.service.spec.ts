import { TestBed } from '@angular/core/testing';

import { BlockCommandService } from './block-command.service';

describe('BlockCommandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlockCommandService = TestBed.get(BlockCommandService);
    expect(service).toBeTruthy();
  });
});
