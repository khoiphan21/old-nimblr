import { TestBed } from '@angular/core/testing';

import { UserFactoryServiceImpl } from './user-factory-impl.service';
import { UserImpl } from '../../classes/user-impl';

describe('UserFactoryService', () => {
  let factory: UserFactoryServiceImpl;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserFactoryServiceImpl]
    });
    factory = TestBed.get(UserFactoryServiceImpl);
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

  it('should retrieve a list of users from ids', done => {
    const ids = [
      '338fc0ff-80be-460a-b255-3cf39383b770',
      'a316da29-4dca-47ba-a771-195cfc07f67b'
    ];
    factory.getUserFromIds(ids).then(users => {
      users.map(user => expect(user instanceof UserImpl).toBe(true));
      expect(users.length).toBe(2);
      done();
    }).catch(error => {
      fail(error);
      done();
    });
  });

  it('should return an empty list if no id is passed in', done => {
    const ids = [];
    factory.getUserFromIds(ids).then(users => {
      expect(users.length).toBe(0);
      done();
    }).catch(error => {
      fail(error);
      done();
    });
  });

  it('should return an empty list if null value is passed in', done => {
    const ids = null;
    factory.getUserFromIds(ids).then(users => {
      expect(users.length).toBe(0);
      done();
    }).catch(error => {
      fail(error);
      done();
    });
  });
});
