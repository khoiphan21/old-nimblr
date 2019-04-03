import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationBarComponent } from './navigation-bar.component';
import { NavigationTabComponent } from './navigation-tab/navigation-tab.component';
import { ServicesModule } from 'src/app/modules/services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationBarService } from '../../services/navigation-bar/navigation-bar.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { NavigationTabDocument } from 'src/app/classes/navigation-tab';
import { configureTestSuite } from 'ng-bullet';
import { AccountService } from 'src/app/services/account/account.service';
import { MockAccountService } from 'src/app/services/account/account-impl.service.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserFactoryService } from 'src/app/services/user/user-factory.service';
class MockNavigationBarService {
  getNavigationBar$() {
    return new BehaviorSubject(false);
  }
  getNavigationBarStatus$() {
    return new BehaviorSubject(false);
  }
}

describe('NavigationBarComponent', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;
  let navigationBarService: NavigationBarService;
  let userFactory: UserFactoryService;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavigationBarComponent,
        NavigationTabComponent
      ],
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        ServicesModule,
        {
          provide: NavigationBarService,
          useClass: MockNavigationBarService
        },
        {
          provide: AccountService,
          useClass: MockAccountService
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationBarComponent);
    userFactory = TestBed.get(UserFactoryService);
    navigationBarService = TestBed.get(NavigationBarService);
    component = fixture.componentInstance;
    component.currentUser = userFactory.createUser('id', 'firstName', 'lastName', 'email');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* tslint:disable:no-string-literal */
  describe('ngOnInit', () => {
    let user;
    beforeEach(() => {
      user = userFactory.createUser('user1', 'john', 'doe', 'johndoe@gmail.com');
      spyOn(component['accountService'], 'getUser$').and.callFake(() => {
        return new BehaviorSubject(user);
      });
      spyOn<any>(component, 'processInitialName');
    });

    it('should set the user to the returned value', () => {
      component.ngOnInit();
      expect(component.currentUser).toEqual(user);
    });

    it('should process user`s first name when there is value', () => {
      component.ngOnInit();
      expect(component['processInitialName']).toHaveBeenCalled();
    });
  });

  /* tslint:disable:no-string-literal */
  it('processInitialName() - should get the first letter of the name', () => {
    const firstName = 'Judy';
    component['processInitialName'](firstName);
    expect(component.initialName).toBe(firstName.charAt(0));
  });

  it('should receive get the right value for the navigation bar status', () => {
    const expectedResult = false;
    spyOn(navigationBarService, 'getNavigationBarStatus$').and.callFake(() => {
      return new BehaviorSubject(expectedResult);
    });
    spyOn(navigationBarService, 'getNavigationBar$').and.callFake(() => {
      return new Subject();
    });
    component.ngOnInit();
    expect(component.isNavigationTabShown).toEqual(expectedResult);
  });

  it('should receive get the right value for the navigationTabs when the data comes in', () => {
    const tab1 = new NavigationTabDocument('tab1', 'nav tab 1', []);
    const tab2 = new NavigationTabDocument('tab2', 'nav tab 2', []);
    const expectedResult = [tab1, tab2];
    spyOn(navigationBarService, 'getNavigationBar$').and.callFake(() => {
      return new BehaviorSubject(expectedResult);
    });
    component.ngOnInit();
    expect(component.navigationTabs).toEqual(expectedResult);
  });
});
