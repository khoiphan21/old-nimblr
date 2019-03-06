import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AccountService } from '../../services/account/account.service';
import { MockAccountService } from '../../services/account/account-impl.service.spec';
import { UserFactoryService } from '../../services/user/user-factory.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userFactory: UserFactoryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      providers: [
        {
          provide: AccountService,
          useClass: MockAccountService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    userFactory = TestBed.get(UserFactoryService);
    component = fixture.componentInstance;
    component.currentUser = userFactory.createUser('id', 'firstName', 'lastName', 'email');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
