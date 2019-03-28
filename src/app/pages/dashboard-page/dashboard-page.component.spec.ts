import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPageComponent } from './dashboard-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentService } from 'src/app/services/document/document.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DocumentFactoryService } from 'src/app/services/document/factory/document-factory.service';
import { configureTestSuite } from 'ng-bullet';
import { AccountService } from 'src/app/services/account/account.service';
import { AccountServiceImpl } from 'src/app/services/account/account-impl.service';
import { Document } from 'src/app/classes/document';
import { isUuid } from 'src/app/classes/helpers';
import { UUID } from 'src/app/services/document/command/document-command.service';
import { CreateDocumentInput, DocumentType, SharingStatus } from 'src/API';

const uuidv4 = require('uuid/v4');

class MockDocumentService {
  getUserDocuments$() {
    return new BehaviorSubject(null);
  }
}

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let documentFactory: DocumentFactoryService;
  let documentService: DocumentService;
  let document: Document;
  let userId: UUID;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardPageComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: DocumentService,
          useClass: MockDocumentService
        },
        {
          provide: AccountService,
          useClass: AccountServiceImpl
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  /* tslint:disable:no-string-literal */
  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    documentService = TestBed.get(DocumentService);
    documentFactory = TestBed.get(DocumentFactoryService);
    document = documentFactory.createDocument({
      id: uuidv4(),
      ownerId: uuidv4()
    });
    // Spy on the account service
    userId = uuidv4();
    spyOn(component['accountService'], 'isUserReady').and.returnValue(
      Promise.resolve({ id: userId })
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* tslint:disable:no-string-literal */
  describe('ngOnInit()', () => {
    let document$: Subject<Array<Document>>;

    beforeEach(() => {
      document$ = new Subject();
      spyOn(component['documentService'], 'getUserDocuments$').and.returnValue(document$);
    });

    it('should receive get the list of documents when notified', done => {
      component.ngOnInit().then(() => {
        expect(component.userDocuments).toEqual([document]);
        done();
      });
      document$.next([document]);
    });

    it('should throw an error if received', done => {
      const mockError = new Error('test');
      component.ngOnInit().catch(error => {
        const message = 'DashboardPage failed to get user documents: '
          + mockError.message;
        expect(error.message).toEqual(message);
        done();
      });
      // setup spy to throw an error
      document$.error(mockError);
    });
  });

  /* tslint:disable:no-string-literal */
  describe('createNewDocument()', () => {
    let routerSpy: jasmine.Spy;
    let commandService: jasmine.Spy;
    const id = 'abcde';

    beforeEach(() => {
      routerSpy = spyOn(component['router'], 'navigate');
      commandService = spyOn(component['documentCommandService'], 'createDocument');
      commandService.and.returnValue({ id });
    });

    describe('calls to createDocument()', () => {
      let args: CreateDocumentInput;
      beforeEach(async () => {
        await component.createNewDocument();
        args = commandService.calls.mostRecent().args[0];
      });
      it('should call createDocument() from Document Service', async () => {
        expect(commandService).toHaveBeenCalled();
      });
      it('should call with a uuid version', async () => {
        expect(isUuid(args.version)).toBe(true);
      });
      it('should call with a GENERIC type', async () => {
        expect(args.type).toBe(DocumentType.GENERIC);
      });
      it('should call with the right ownerId', async () => {
        expect(args.ownerId).toBe(userId);
      });
      it('should call with the right lastUpdatedBy', async () => {
        expect(args.lastUpdatedBy).toBe(userId);
      });
      it('should call with PRIVATE sharing status', async () => {
        expect(args.sharingStatus).toBe(SharingStatus.PRIVATE);
      });
    });

    it('should navigate to the right "document" page when done', async () => {
      await component.createNewDocument();
      expect(routerSpy).toHaveBeenCalledWith([`/document/abcde`]);
    });
  });
});
