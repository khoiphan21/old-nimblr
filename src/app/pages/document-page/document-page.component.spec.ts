import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentPageComponent } from './document-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

describe('DocumentPageComponent', () => {
  let component: DocumentPageComponent;
  let fixture: ComponentFixture<DocumentPageComponent>;
  let routerSpy;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentPageComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* tslint:disable:no-string-literal */
  it('navigateToDocument() - should navigate to the right path', () => {
    routerSpy = spyOn(component['router'], 'navigate');
    const uuid = 'd232cdb5-142d-4d77-afb3-8ac638f9755b';
    const uuid2 = 'd232cdb5-142d-4d77-afb3-8ac638f9753b';
    component.navigateToChildDocument(uuid, uuid2);
    const navigatedPath = routerSpy.calls.mostRecent().args[0];
    expect(navigatedPath).toEqual([`document/${uuid}`, uuid2]);
  });

  it('should call localstorage when the navigation ends', () => {
    spyOn(localStorage, 'setItem');
    const navigationEnd = new NavigationEnd(0, '', '/document/test123');
    const mockRouter: any = {
      events: new BehaviorSubject(navigationEnd)
    };
    component['router'] = mockRouter;
    component.ngOnInit();
    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
