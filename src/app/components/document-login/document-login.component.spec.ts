import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLoginComponent } from './document-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { MockAccountService } from 'src/app/services/account/account-impl.service.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';

describe('DocumentLoginComponent', () => {
  let component: DocumentLoginComponent;
  let fixture: ComponentFixture<DocumentLoginComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentLoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: AccountService,
          useClass: MockAccountService
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentLoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
