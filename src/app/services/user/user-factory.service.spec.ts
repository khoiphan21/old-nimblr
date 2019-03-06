import { TestBed } from '@angular/core/testing';

import { UserFactoryService } from './user-factory.service';

describe('UserFactoryService', () => {
  let factory: UserFactoryService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    factory = TestBed.get(UserFactoryService);
  });

  it('should be created', () => {
    expect(factory).toBeTruthy();
  });

  it('should create a User object', () => {
    const id = 'id';
    const first = 'first';
    const last = 'last';
    const email = 'email';

    const user = factory.createUser(id, first, last, email);
    expect(user.id).toBe(id);
    expect(user.firstName).toBe(first);
    expect(user.lastName).toBe(last);
    expect(user.email).toBe(email);
  });

});
