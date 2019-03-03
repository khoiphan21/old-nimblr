import { TestBed } from '@angular/core/testing';

import { UserFactoryService } from './user-factory.service';
import { UserImpl } from '../../classes/user-impl';

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

  it('should retrieve a list of users from ids', done => {
    const ids = [
      '85a705f1-7485-4efd-9e4a-d196ff8c9219'
    ];
    factory.getUserFromIds(ids).then(users => {
      users.map(user => expect(user instanceof UserImpl).toBe(true));
      expect(users.length).toBe(1);
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
