import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationBarComponent } from './navigation-bar.component';
import { NavigationTabComponent } from './navigation-tab/navigation-tab.component';
import { ServicesModule } from 'src/app/modules/services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationBarService } from '../../services/navigation-bar/navigation-bar.service';
import { Subject, BehaviorSubject } from 'rxjs';

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

  beforeEach(async(() => {
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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationBarComponent);
    navigationBarService = TestBed.get(NavigationBarService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should receive get the right value for the navigation bar status when the data comes in', () => {
    const expectedResult = false;
    spyOn(navigationBarService, 'getNavigationBarStatus$').and.callFake(() => {
      return new BehaviorSubject(expectedResult);
    });
    component.ngOnInit();
    expect(component.isNavigationTabShown).toEqual(expectedResult);
  });
});
