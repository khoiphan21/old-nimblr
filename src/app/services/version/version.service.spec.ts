import { TestBed } from '@angular/core/testing';

import { VersionService } from './version.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationStart } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';

describe('VersionService', () => {
  let service: VersionService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    });
    service = TestBed.get(VersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registerVersion()', () => {
    let subscribeSpy: jasmine.Spy;

    beforeEach(() => {
      // tslint:disable:no-string-literal
      service['isRouterSubscriptionReady'] = false;
      subscribeSpy = spyOn<any>(service, 'subscribeToRouter');
    });

    it('should store the given version', () => {
      const version = 'abcd';
      service.registerVersion(version);
      // tslint:disable:no-string-literal
      expect(service['myVersions'].has(version)).toBe(true);
    });
    it('should call subscribeToRouter() if not yet done', () => {
      service.registerVersion('abcd');
      expect(subscribeSpy).toHaveBeenCalled();
    });
    it('should not call subscribeToRouter() again if already done so', () => {
      service['isRouterSubscriptionReady'] = true;
      service.registerVersion('abcd');
      expect(subscribeSpy).not.toHaveBeenCalled();
    });
    it('should set the router subscription to be ready', () => {
      service.registerVersion('abcd');
      expect(service['isRouterSubscriptionReady']).toBe(true);
    });
  });

  describe('subscribeToRouter()', () => {
    let handler: any;
    const version = '1234';

    beforeEach(() => {
      const eventSpy = spyOn(service['router'].events, 'forEach');
      service['subscribeToRouter']();
      handler = eventSpy.calls.mostRecent().args[0];

      // Reset the versions
      service['myVersions'].clear();
      service['myVersions'].add(version);
    });
    it('should clear the versions if the event is of type NavigationStart', () => {
      const event = new NavigationStart(1234, 'abcd');
      handler(event);
      expect(service['myVersions'].size).toBe(0);
    });
    it('should NOT clear the versions if the event is not of the right type', () => {
      const event = 1234;
      handler(event);
      expect(service['myVersions'].size).toBe(1);
    });
  });

  describe('checkAndDelete()', () => {
    it('should return true for a stored version', () => {
      const version = 'abcd';
      service.registerVersion(version);
      expect(service.isRegistered(version)).toBe(true);
    });
    it('should return false for a unstored version', () => {
      expect(service.isRegistered('random')).toBe(false);
    });
  });
});
