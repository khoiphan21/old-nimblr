import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MockAccountService } from 'src/app/services/account/account-impl.service.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { configureTestSuite } from 'ng-bullet';
import { User } from 'src/app/classes/user';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentFactoryService } from 'src/app/services/document/factory/document-factory.service';
import { DocumentContentComponent } from './document-content.component';
import { ServicesModule } from 'src/app/modules/services.module';
import { AccountService } from 'src/app/services/account/account.service';

const uuidv4 = require('uuid/v4');

describe('(Interface Unit Tests) DocumentContentComponent', () => {
  let component: DocumentContentComponent;
  let fixture: ComponentFixture<DocumentContentComponent>;
  let documentFactory: DocumentFactoryService;
  let router;
  // mock data for testing
  const id = uuidv4();
  const testUser: User = {
    id,
    firstName: 'first',
    lastName: 'last',
    email: 'abcd@email.com'
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentContentComponent,
      ],
      imports: [
        ServicesModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: AccountService,
          useClass: MockAccountService
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: new BehaviorSubject({
              get: () => id
            })
          }
        },
        {
          provide: Router,
          useValue: {
            url: '/document'
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  /* tslint:disable:no-string-literal */
  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentContentComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component['currentUser'] = testUser;
    documentFactory = TestBed.get(DocumentFactoryService);
    fixture.detectChanges();
  });

  describe('Story: Change document type to a Form Template', () => {
    // it('should not show the template and submission elements initially', () => {
    //   fail('to be tested');
    // });
  });
});
