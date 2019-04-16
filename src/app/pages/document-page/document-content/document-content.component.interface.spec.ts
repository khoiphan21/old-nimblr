import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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
import { DocumentType } from '../../../../API';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const uuidv4 = require('uuid/v4');

describe('(UI) DocumentContentComponent', () => {
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
        BrowserAnimationsModule,
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
    // set some default values
    component['currentUser'] = testUser;
    component.isDocumentReady = true; // so that the content will get rendered

    documentFactory = TestBed.get(DocumentFactoryService);
    fixture.detectChanges();
  });

  describe('Send Form button', () => {
    const BUTTON_CLASS_SELECTOR = '.filled-button-primary';

    it('should show when the documentType is TEMPLATE', () => {
      component.documentType = DocumentType.TEMPLATE;
      fixture.detectChanges();

      const sendFormButton = fixture.debugElement.query(By.css(BUTTON_CLASS_SELECTOR));

      expect(sendFormButton).not.toBe(null);
    });

    it('should not show when the documentType is SUBMISSION', () => {
      component.documentType = DocumentType.SUBMISSION;
      fixture.detectChanges();

      const sendFormButton = fixture.debugElement.query(By.css(BUTTON_CLASS_SELECTOR));

      expect(sendFormButton).toBe(null);
    });

    it('should not show when the documentType is GENERIC', () => {
      component.documentType = DocumentType.GENERIC;
      fixture.detectChanges();

      const sendFormButton = fixture.debugElement.query(By.css(BUTTON_CLASS_SELECTOR));

      expect(sendFormButton).toBe(null);
    });
  });
});
