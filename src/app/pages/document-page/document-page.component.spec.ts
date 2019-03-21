import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPageComponent } from './document-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ServicesModule } from '../../modules/services.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account/account.service';
import { MockAccountService } from 'src/app/services/account/account-impl.service.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { configureTestSuite } from 'ng-bullet';
import { User } from 'src/app/classes/user';

const uuidv4 = require('uuid/v4');

fdescribe('DocumentPageComponent', () => {
  let component: DocumentPageComponent;
  let fixture: ComponentFixture<DocumentPageComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentPageComponent,
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
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentPageComponent);
    component = fixture.componentInstance;
  });

  /* tslint:disable:no-string-literal */
  describe('ngOnInit()', () => {
    let checkUserSpy: jasmine.Spy;

    beforeEach(() => {
      // setup the spy
      checkUserSpy = spyOn(component, 'checkUser');
    });

    it('should call to check the user', () => {
      checkUserSpy.and.returnValue(new Promise(() => { }));
      // now call ngOnInit
      component.ngOnInit();
      expect(checkUserSpy.calls.count()).toBe(1);
    });

    describe('[SUCCESS]', () => {
      let retrieveDocumentSpy: jasmine.Spy;
      let testUser: User = {
        id: uuidv4(),
        firstName: 'first',
        lastName: 'last',
        email: 'abcd@email.com'
      };

      beforeEach(() => {
        retrieveDocumentSpy = spyOn<any>(component, 'retrieveDocumentData');
        checkUserSpy.and.returnValue(Promise.resolve(testUser));
      });

      it('should store the retrieved user', done => {
        component.ngOnInit().then(() => {
          expect(component['currentUser']).toEqual(testUser);
          done();
        });
      });

      it('should call retrieveDocumentData', done => {
        component.ngOnInit().then(() => {
          expect(retrieveDocumentSpy.calls.count()).toBe(1);
          done();
        });
      });
    });

    describe('[ERROR]', () => {
      it('should throw the error received', done => {
        const mockError = new Error('test');
        checkUserSpy.and.returnValue(Promise.reject(mockError));
        component.ngOnInit().catch(error => {
          const message = `DocumentPage failed to load: ${mockError.message}`;
          expect(error.message).toEqual(message);
          done();
        });
      });
    });

  });

  it('should create', done => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    done();
  });
});
