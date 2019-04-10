import { TestBed } from '@angular/core/testing';

import { VersionService } from './version.service';

describe('VersionService', () => {
  let service: VersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(VersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registerVersion()', () => {
    it('should store the given version', () => {
      const version = 'abcd';
      service.registerVersion(version);
      // tslint:disable:no-string-literal
      expect(service['myVersions'].has(version)).toBe(true);
    });
  });

  describe('checkAndDelete()', () => {
    it('should return true for a stored version', () => {
      const version = 'abcd';
      service.registerVersion(version);
      expect(service.checkAndDelete(version)).toBe(true);
    });
    it('should return false for a unstored version', () => {
      expect(service.checkAndDelete('random')).toBe(false);
    });
    it('should delete the version once checked', () => {
      const version = 'abcd';
      service.registerVersion(version);
      service.checkAndDelete(version);
      // at this point the version musthave been removed
      expect(service.checkAndDelete(version)).toBe(false);
    });
  });
});
