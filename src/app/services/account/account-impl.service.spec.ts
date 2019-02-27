import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AccountServiceImpl } from './account-impl.service';
import { ServicesModule } from '../../modules/services.module';
import { skip } from 'rxjs/operators';
import { UserImpl } from 'src/app/classes/user-impl';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
<<<<<<< HEAD
import { User } from 'src/app/classes/user';
export const TEST_EMAIL = 'test';
export const TEST_PASSWORD = 'Password1234';
export const TEST_USER_ID = '338fc0ff-80be-460a-b255-3cf39383b770';
=======

export const TEST_USERNAME = 'khoi-test';
export const TEST_PASSWORD = 'Khoi1234';
export const TEST_USER_ID = '85a705f1-7485-4efd-9e4a-d196ff8c9219';
>>>>>>> d1dfc6f3f836b8170936d30f34165610189f599e

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
    service.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
      // should resolve
      done();
    }).catch(error => {
      console.error(error);
      fail(error);
      done();
    });
  });

  it('should fail in the credentials are wrong', done => {
    const password = 'WRONG PASSWORD';

    service.login(TEST_USERNAME, password).then(() => {
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
    service.login(TEST_USERNAME, TEST_PASSWORD).catch(error => {
      fail(error);
      done();
    });
  });

  describe('RegisterService', () => {
    // const email = 'testing' + Math.random() + '@testmail.au';
    const email = "brunocyh@gmail.com";
    const user = {
      id: email,
      firstName: 'bruno',
      lastName: 'testheng',
      email: email
    };
    const password = "Qwerty123";

    console.log('user info: ', user);

    it('should register a user in cognito', done => {
      service.registerCognitoUser(user, password).then(data => {
        console.log('Registered a cognitor user: ', data);
        done();
      });

    });

    fit('should verify the user and then register them in dynamodb', done => {
      const verificationCode = '049540';
      service.registerAppUser(user, password, verificationCode).then(data => {
        console.log('Register a App user: ', data);
        done();
      });
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
      service.login(TEST_EMAIL, TEST_PASSWORD)
        .then(() => {
          console.log('step 1');
          return service.logout();

        })
        .then(() => {
          try {
            console.log('step 2');
            // then performs a private operation:
            console.log(service.update(user));
            fail('private operation shouldnt be performing when logged out');
            done();
          } catch (err) {
            console.log(err);
            done();
          }
        });
    });
  });

  describe('update()', () => {
    const user: User = {
      id: "abc123",
      firstName: "tester",
      lastName: "telstra",
      email: "changed@test.com"
    };

    beforeEach(() => {
      // Login before everything
      service.login(TEST_EMAIL, TEST_PASSWORD).then(
        data => console.log(data));
    });

    it('should update the attributes on dynamodb', done => {
      service.update(user);
    });

  });

  describe('getUser$()', () => {
    it('should retrieve a user if the user session is still valid', done => {
      service.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
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
      service.login(TEST_USERNAME, TEST_PASSWORD).then(() => {
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
