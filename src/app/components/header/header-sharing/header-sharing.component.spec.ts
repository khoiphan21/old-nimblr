import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSharingComponent } from './header-sharing.component';
import { SharingStatus } from 'src/API';

describe('HeaderSharingComponent', () => {
  let component: HeaderSharingComponent;
  let fixture: ComponentFixture<HeaderSharingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderSharingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSharingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should set isPublic to false if sharing is PRIVATE', () => {
      component.sharingStatus = SharingStatus.PRIVATE;
      component.ngOnInit();
      expect(component.isPublic).toBe(false);
    });
    it('should set isPublic to true if sharing is PUBLIC', () => {
      component.sharingStatus = SharingStatus.PUBLIC;
      component.ngOnInit();
      expect(component.isPublic).toBe(true);
    });
  });

  describe('hideSharing()', () => {
    it('should emit the event value as false', done => {
      component.hideSharingEvent.subscribe(value => {
        expect(value).toBe(false);
        done();
      });
      component.hideSharing();
    });
  });

  describe('copyPageLink()', () => {
    it('should call document to copy', () => {
      const execSpy = spyOn(document, 'execCommand');
      component.copyPageLink();
      expect(execSpy).toHaveBeenCalledWith('copy');
    });
  });

  describe('toggleSharing()', () => {
    it('should toggle isPublic at the end of each call', () => {
      component.isPublic = false;
      component.toggleSharing();
      expect(component.isPublic).toBe(true);
      component.toggleSharing();
      expect(component.isPublic).toBe(false);
    });
    it('should emit PRIVATE if public is being toggled off', done => {
      component.isPublic = true;
      component.changeSharingStatus.subscribe(value => {
        expect(value).toBe(SharingStatus.PRIVATE);
        done();
      });
      component.toggleSharing();
    });
    it('should emit PUBLIC if public is being toggled on', done => {
      component.isPublic = false;
      component.changeSharingStatus.subscribe(value => {
        expect(value).toBe(SharingStatus.PUBLIC);
        done();
      });
      component.toggleSharing();
    });
  });
});
