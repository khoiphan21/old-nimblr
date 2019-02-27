import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AccountServiceImpl } from './account-impl.service';
import { ServicesModule } from '../../modules/services.module';
import { skip } from 'rxjs/operators';
import { UserImpl } from 'src/app/classes/user-impl';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { User } from 'src/app/classes/user';
export const TEST_EMAIL = 'test';
export const TEST_PASSWORD = 'Password1234';
export const TEST_USER_ID = '338fc0ff-80be-460a-b255-3cf39383b770';

@Component({
  selector: 'app-header',
  template: ''
})
export class BlankComponent { }

describe('AccountImplService', () => {
  let service: AccountServiceImpl;
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlankComponent],
      providers: [AccountServiceImpl],
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([
          {
            path: 'login', component: BlankComponent
          }
        ])
      ]
    });
    service = TestBed.get(AccountServiceImpl);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login if the credentials are correct', done => {
    service.login(TEST_EMAIL, TEST_PASSWORD).then(() => {
      // should resolve
      done();
    }).catch(error => {
      console.error(error);
      fail('Error occurred');
      done();
    });
  });

  it('should fail in the credentials are wrong', done => {
    const password = 'WRONG PASSWORD';

    service.login(TEST_EMAIL, password).then(() => {
      // should have failed
      fail('Promise should be rejected');
      done();
    }).catch(() => {
      done();
    });
  });

  it('should emit a new user object if successfully logged in', done => {
    // Setup subscription for assertion
    service.getUser$().subscribe(value => {
      // should be called here
      done();
    }, error => {
      fail(error);
      done();
    });
    // Call login method here
    service.login(TEST_EMAIL, TEST_PASSWORD).catch(error => {
      fail(error);
      done();
    });
  });

  describe('Logout', () => {
    const user: User = {
      id: "abc123",
      firstName: "tester",
      lastName: "tesla",
      email: "notshownindb@test.com"
    };

    it('should throw error when a private operation is perform after logout', done => {
      service.login(TEST_EMAIL, TEST_PASSWORD).then(() => {
        service.logout();

        // then performs a private operation:
        try {
          service.update(user);
          fail('private operation shouldnt be performing when logged out');
          done();
        } catch (err) {
          console.log(err);
          done();
        }
      });
    });

  });

  describe('update', () => {

    const user: User = {
      id: "abc123",
      firstName: "tester",
      lastName: "telstra",
      email: "changed@test.com"
    };

    it('should update the attributes on dynamodb', done => {
      service.update(user);
    })
  });

  describe('getUser$()', () => {
    it('should retrieve a user if the user session is still valid', done => {
      service.login(TEST_EMAIL, TEST_PASSWORD).then(() => {
        // 'Reset' the observable, pretending that it's empty
        service['user$'].next(null);
        service.getUser$().pipe(skip(1)).subscribe(user => {
          expect(user instanceof UserImpl).toBe(true);
          done();
        });
      });
    });

    it(`should reroute to "login" if a session doesn't exist`, done => {
      const routerSpy = spyOn(router, 'navigate');
      Auth.signOut()
        .then(() => {
          service.getUser$().subscribe(() => {
          }, () => {
            expect(routerSpy).toHaveBeenCalled();
            done();
          });
        })
        .catch(err => { console.error(err); done(); });
    });
  });

  describe('isUserReady()', () => {

    it('should resolve if a session exists', (done) => {
      service.login(TEST_EMAIL, TEST_PASSWORD).then(() => {
        service.isUserReady().then(user => {
          expect(user instanceof UserImpl).toBe(true);
          done();
        });
      });
    });

    it('should reject if no user available', done => {
      Auth.signOut().then(() => {
        service.isUserReady().then(user => {
          fail('error must occur');
        }).catch(() => done());
      });
    });

  });


});
