import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationTabComponent } from './navigation-tab.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Auth } from 'aws-amplify';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('NavigationTabComponent', () => {
  let component: NavigationTabComponent;
  let fixture: ComponentFixture<NavigationTabComponent>;
  let routerSpy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavigationTabComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  /* tslint:disable:no-string-literal */
  beforeEach(() => {
  });

  it('should create', done => {
    Auth.signOut().then(() => {
      fixture = TestBed.createComponent(NavigationTabComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component).toBeTruthy();
      done();
    });
  });

  it('navigateToDocument() - should navigate to the right path', () => {
    routerSpy = spyOn(component['router'], 'navigate');
    const expectedId = 'document123';
    component.navigateToDocument(expectedId);
    const navigatedPath = routerSpy.calls.mostRecent().args[0];
    expect(navigatedPath).toEqual(['/document', expectedId]);
  });
});
