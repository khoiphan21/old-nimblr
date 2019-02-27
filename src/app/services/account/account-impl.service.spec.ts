import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AccountServiceImpl } from './account-impl.service';
import { ServicesModule } from '../../modules/services.module';
import { skip } from 'rxjs/operators';
import { UserImpl } from 'src/app/classes/user-impl';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';

export const TEST_USERNAME = 'khoi-test';
export const TEST_PASSWORD = 'Khoi1234';
export const TEST_USER_ID = '85a705f1-7485-4efd-9e4a-d196ff8c9219';

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
      console.log(error);
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
