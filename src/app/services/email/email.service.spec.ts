import { TestBed } from '@angular/core/testing';

import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(EmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // fdescribe('send()', () => {
  //   it('testing', () => {
  //     service.send('document/a735f371-905c-4c8a-8a96-c7dedbc36b2d');
  //     fail();
  //   });
  // });
});
