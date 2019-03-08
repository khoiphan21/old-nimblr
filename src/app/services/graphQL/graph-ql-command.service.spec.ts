import { TestBed } from '@angular/core/testing';

import { GraphQlCommandService } from './graph-ql-command.service';

describe('GraphQlCommandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphQlCommandService = TestBed.get(GraphQlCommandService);
    expect(service).toBeTruthy();
  });

  describe('Integration Tests', () => {
    beforeAll(() => { });
    beforeEach(() => { });

    it('should perform the corresponding query in backend with correct values', () => {

    });

  });

  describe('Unit Tests', () => {
    beforeAll(() => { });
    beforeEach(() => { });

    it('should return a Promise type when query is registered correctly', () => {

    });

    it('should return a Promise type when error', () => {

    });

    it('should resend the same query after timeout if there is no response from cloud API', () => {

    });

    it('should stack up the queue when new query comes in', () => {

    });

    it('should stores all queries in one task queue only', () => {

    });

    it('should perform queries in FIFO order', () => {

    });

    it('should store all queries in chronological order according to its registered time', () => {

    });

    it('should remove query from queue when API response', () => {

    });

    it('should resolve the corresponding Promise after API response and been removed from queue', () => {

    });

    it('should clear out the queue eventually if queries are processed successfully', () => {

    });
  });

});

