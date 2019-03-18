import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPageComponent } from './dashboard-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/document/document.service';
import { Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class MockDocumentService {
  getUserDocuments$() {
    return new Subject();
  }
  createFormDocument() {}
}

xdescribe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let documentService;
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createNewFormDocument()', () => {
    it('should call createFormDocument() from Document Service', () => {
      spyOn(documentService, 'createFormDocument');
      component.createNewFormDocument();
      expect(documentService.createFormDocument).toHaveBeenCalled();
    });

    xit('should navigate to "document" page when the function is called', () => {
      component.createNewFormDocument();
      // const routerSpy = spyOn(component['router'], 'navigate');
      // expect(routerSpy.calls.count()).toBe(1);
    });
  });
});
