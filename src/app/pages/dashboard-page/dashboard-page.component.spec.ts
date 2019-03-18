import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPageComponent } from './dashboard-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentService } from 'src/app/services/document/document.service';
import { BehaviorSubject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DocumentFactoryService } from 'src/app/services/document/factory/document-factory.service';
const uuidv4 = require('uuid/v4');

class MockDocumentService {
  getUserDocuments$() {
    return new BehaviorSubject(false);
  }
  createFormDocument() { }
}

fdescribe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let documentFactory: DocumentFactoryService;
  let documentService;
  let document;
  beforeEach(async(() => {
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
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    documentService = TestBed.get(DocumentService);
    documentFactory = TestBed.get(DocumentFactoryService);
    document = documentFactory.createDocument({
      id: uuidv4(),
      ownerId: uuidv4()
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive get the right value when the data comes in', () => {
    spyOn(documentService, 'getUserDocuments$').and.callFake(() => {
      return new BehaviorSubject([document]);
    });
    component.ngOnInit();
    expect(component.userDocuments).toEqual([document]);
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
