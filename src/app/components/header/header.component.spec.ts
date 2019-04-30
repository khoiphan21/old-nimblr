import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AccountService } from '../../services/account/account.service';
import { MockAccountService } from '../../services/account/account-impl.service.spec';
import { DocumentService } from 'src/app/services/document/document.service';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharingStatus } from 'src/API';
import { ResponsiveModule } from 'ngx-responsive';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        ResponsiveModule.forRoot()
      ],
      providers: [
        DocumentService,
        {
          provide: AccountService,
          useClass: MockAccountService
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* tslint:disable:no-string-literal */
  it('showNavigationBar() - should call setNavigationBarStatus() from the service', () => {
    spyOn(component['navigationBarService'], 'setNavigationBarStatus');
    component.showNavigationBar();
    expect(component['navigationBarService'].setNavigationBarStatus).toHaveBeenCalled();
  });


  describe('showInvite()', () => {
    it('should emit the event value as true', done => {
      component.showInviteEvent.subscribe(value => {
        expect(value).toBe(true);
        done();
      });
      component.showInvite();
    });
  });

  describe('manageHeaderContent should set `currentUrl` to the right value', () => {
    it('when url is dashboard', () => {
      component['manageHeaderContent']('/dashboard');
      expect(component.currentUrl).toBe('dashboard');
    });

    it('when url is not dashboard', () => {
      component['manageHeaderContent']('/document');
      expect(component.currentUrl).toBe('document');
    });
  });

  describe('changeSharingStatus()', () => {
    it('should emit the new status', done => {
      component.sharingChange.subscribe(status => {
        expect(status).toEqual(SharingStatus.PUBLIC);
        done();
      });
      component.changeSharingStatus(SharingStatus.PUBLIC);
    });
  });

  describe('saveAsTemplate()', () => {
    it('should emit the event', done => {
      component.saveAsTemplateEvent.subscribe(() => {
        expect().nothing();
        done();
      });
      component.saveAsTemplate();
    });
  });

  describe('deleteThisDocument()', () => {
    it('should emit deleteDocumentEvent', done => {
      component.deleteDocumentEvent.subscribe(() => done());
      component.deleteThisDocument();
    });

    it('should trigger page redirection', () => {
      const spyNavi = spyOn(component['router'], 'navigate');
      component.deleteThisDocument();
      expect(spyNavi.calls.count()).toBe(1);
    });
  });

});
