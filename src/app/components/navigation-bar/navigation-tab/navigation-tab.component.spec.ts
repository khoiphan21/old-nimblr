import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationTabComponent } from './navigation-tab.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationTabDocument } from 'src/app/classes/navigation-tab';

describe('NavigationTabComponent', () => {
  let component: NavigationTabComponent;
  let fixture: ComponentFixture<NavigationTabComponent>;
  let routerSpy;
  let router;
  const uuid = '8c027cae-4be2-4d84-bcaa-37ebc8c3e24a';
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavigationTabComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: Router,
          useValue: {
             url: '/document',
             navigate: ''
          }
       }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  /* tslint:disable:no-string-literal */
  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationTabComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.navigationTab = new NavigationTabDocument(uuid, 'test', []);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
      beforeEach(() => {
        router.url = '/document/8c027cae-4be2-4d84-bcaa-37ebc8c3e24a';
      });

      it('should set value to true if it is the same document', () => {
        component.navigationTab = new NavigationTabDocument(uuid, 'test', []);
        component.ngOnInit();
        expect(component.isCurrentDocument).toBe(true);
      });

      it('should set value to false if it is the same document', () => {
        const falseUuid = '7d232med-4be2-4d84-bcaa-37ebc8c3e24a';
        component.navigationTab = new NavigationTabDocument(falseUuid, 'test', []);
        component.ngOnInit();
        expect(component.isCurrentDocument).toBe(false);
      });
  });

  it('navigateToDocument() - should navigate to the right path', () => {
    routerSpy = spyOn(router, 'navigate');
    const expectedId = 'document123';
    component.navigateToDocument(expectedId);
    const navigatedPath = routerSpy.calls.mostRecent().args[0];
    expect(navigatedPath).toEqual(['/document', expectedId]);
  });
});
