
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
import { ResponsiveModule } from 'ngx-responsive';
import { DocumentType } from '../../../API';
import { By } from '@angular/platform-browser';

describe('(UI) NavigationBarComponent', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;
  let userFactory: UserFactoryService;

  let navigationBar$: BehaviorSubject<any>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavigationBarComponent,
        NavigationTabComponent
      ],
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([]),
        ResponsiveModule.forRoot()
      ],
      providers: [
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
    component = fixture.componentInstance;

    // Setup spies
    // tslint:disable:no-string-literal
    navigationBar$ = new BehaviorSubject([]);
    spyOn(component['navigationBarService'], 'getNavigationBarStatus$').and.returnValue(new BehaviorSubject(true));
    spyOn(component['navigationBarService'], 'getNavigationBar$').and.returnValue(navigationBar$);
    spyOn(component['accountService'], 'getUser$').and.returnValue(new BehaviorSubject(null));

    // setup some initial values
    component.isNavigationTabShown = true;
    component.currentUser = userFactory.createUser('id', 'firstName', 'lastName', 'email');
    component.navigationTabs = [];

    fixture.detectChanges();
  });

  it('should not show the navigation tab if the type is SUBMISSION', () => {
    // call ngOnInit() to setup the subscriptions
    component.ngOnInit();

    // emit a new array of tabs and re-render
    const tab = new NavigationTabDocument({
      id: 'test',
      title: 'title',
      type: DocumentType.SUBMISSION,
      children: []
    });
    navigationBar$.next([tab]);
    fixture.detectChanges();

    // check if the app-navigation-tab exist
    const tabElement = fixture.debugElement.query(By.css('app-navigation-tab'));
    expect(tabElement).toBe(null);
  });
});
