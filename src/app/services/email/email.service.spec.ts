import { TestBed } from '@angular/core/testing';

import { EmailService } from './email.service';
import { configureTestSuite } from 'ng-bullet';

// tslint:disable:no-string-literal
describe('EmailService', () => {
  let service: EmailService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({});
  });

  beforeEach(() => {
    service = TestBed.get(EmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sendInvitationEmail()', () => {
    it('should call send()', async () => {
      spyOn<any>(service, 'send');
      service.sendInvitationEmail({
        email: 'test',
        documentId: 'abcd',
        sender: null
      });
      expect(service['send']).toHaveBeenCalled();
    });
  });

  describe('send()', () => {
    let ses: any;
    let sesSpy: jasmine.Spy;
    let params: any;

    beforeEach(() => {
      ses = {
        sendEmail: () => { }
      };
      params = { test: 'value' };
      sesSpy = spyOn(ses, 'sendEmail');
    });

    it('should call sendEmail of the given service with the right params', async () => {
      service['send'](ses, params);
      expect(sesSpy.calls.mostRecent().args[0]).toEqual(params);
    });

    it('should resolve with the data given', async () => {
      const data = { test: 'value2' };
      sesSpy.and.callFake((_, callback) => {
        callback(null, data);
      });
      const value = await service['send'](ses, params);
      expect(value).toEqual(data);
    });

    it('should reject with the error given', async () => {
      const error = new Error('test');
      sesSpy.and.callFake((_, callback) => {
        callback(error, null);
      });
      try {
        await service['send'](ses, params);
        fail('error must occur');
      } catch (thrownError) {
        expect(thrownError).toEqual(error);
      }
    });

  });

});
