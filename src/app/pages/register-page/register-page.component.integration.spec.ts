import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPageComponent } from './register-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountService } from '../../services/account/account.service';
import { AccountServiceImpl } from '../../services/account/account-impl.service';
import { processTestError } from 'src/app/classes/test-helpers.spec';
import { environment } from 'src/environments/environment';
import { TEST_USERNAME, TEST_PASSWORD } from '../../services/loginHelper';
import { configureTestSuite } from 'ng-bullet';

describe('(Integration) RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;
  let accountService: AccountService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
    declarations: [
        RegisterPageComponent
      ],
      imports: [
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: AccountService,
          useClass: AccountServiceImpl
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPageComponent);
    accountService = TestBed.get(AccountService);
    component = fixture.componentInstance;
    spyOn(accountService, 'registerAppUser').and.returnValue(Promise.resolve());
  });

  /* tslint:disable:no-string-literal */
  it('should get the details of a AWS signed in user', done => {
    // setup spy on the router
    const routerSpy = spyOn(component['router'], 'navigate');
    // setup the values for the test
    component.uuid = 'bla';
    component.newCognitoUser = {
      username: TEST_USERNAME,
      password: TEST_PASSWORD,
      attributes: null
    };
    component.getCognitoUserDetails().then(() => {
      // TODO: REFACTOR THE TEST FOR ROUTERSPY INTO ITS OWN TEST
      expect(routerSpy.calls.count()).toBe(1);
      expect(component.newCognitoUser.attributes).not.toBe(null);
      done();
    }).catch(error => processTestError('error during logic step', error, done));
  }, environment.TIMEOUT_FOR_UPDATE_TEST);

});
