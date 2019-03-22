import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationBarComponent } from './navigation-bar.component';
import { NavigationTabComponent } from './navigation-tab/navigation-tab.component';
import { ServicesModule } from 'src/app/modules/services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationBarService } from '../../services/navigation-bar/navigation-bar.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { NavigationTabDocument } from 'src/app/classes/navigation-tab';
import { configureTestSuite } from 'ng-bullet';
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
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationBarComponent);
    navigationBarService = TestBed.get(NavigationBarService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
