import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AccountService } from '../../services/account/account.service';
import { MockAccountService } from '../../services/account/account-impl.service.spec';
import { UserFactoryService } from '../../services/user/user-factory.service';
import { HeaderOptionsComponent } from './header-options/header-options.component';
import { DocumentService } from 'src/app/services/document/document.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userFactory: UserFactoryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        HeaderOptionsComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        DocumentService,
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
