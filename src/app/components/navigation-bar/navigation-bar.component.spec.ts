import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationBarComponent } from './navigation-bar.component';
import { NavigationTabComponent } from './navigation-tab/navigation-tab.component';
import { ServicesModule } from 'src/app/modules/services.module';
import { BlankComponent } from '../../services/account/account-impl.service.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationBarService } from '../../services/navigation-bar/navigation-bar.service';
import { Subject } from 'rxjs';

class MockNavigationBarService {
  getNavigationBar$() {
    return new Subject();
  }
}

describe('NavigationBarComponent', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavigationBarComponent,
        NavigationTabComponent,
        BlankComponent
       ],
        imports: [
          ServicesModule,
          RouterTestingModule.withRoutes([
            {
              path: 'document', component: BlankComponent
            }
          ])
        ],
        providers: [
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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
