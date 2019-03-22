import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPageComponent } from './dashboard-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentService } from 'src/app/services/document/document.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DocumentFactoryService } from 'src/app/services/document/factory/document-factory.service';
import { configureTestSuite } from 'ng-bullet';

const uuidv4 = require('uuid/v4');

class MockDocumentService {
  getUserDocuments$() {
    return new BehaviorSubject(null);
  }
  createFormDocument() { }
}

fdescribe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let documentFactory: DocumentFactoryService;
  let documentService;
  let document;
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
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    documentService = TestBed.get(DocumentService);
    documentFactory = TestBed.get(DocumentFactoryService);
    document = documentFactory.createDocument({
      id: uuidv4(),
      ownerId: uuidv4()
    });
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
  describe('createNewFormDocument()', () => {
    let routerSpy;
    beforeEach(() => {
      routerSpy = spyOn(component['router'], 'navigate');
    });

    it('should call createFormDocument() from Document Service', () => {
      spyOn(documentService, 'createFormDocument');
      component.createNewFormDocument();
      expect(documentService.createFormDocument).toHaveBeenCalled();
    });

    it('should navigate to "document" page when the function is called', () => {
      component.createNewFormDocument();
      expect(routerSpy.calls.count()).toBe(1);
    });
  });
});
