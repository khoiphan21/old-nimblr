import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationTabComponent } from './navigation-tab.component';
import { BlankComponent } from '../../../services/account/account-impl.service.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { Auth } from 'aws-amplify';

describe('NavigationTabComponent', () => {
  let component: NavigationTabComponent;
  let fixture: ComponentFixture<NavigationTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavigationTabComponent,
        BlankComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'document', component: BlankComponent
          }
        ])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
  });
  
  it('should create', done => {
    Auth.signOut().then(() => {
      fixture = TestBed.createComponent(NavigationTabComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component).toBeTruthy();
      done();
    });
  });
});
