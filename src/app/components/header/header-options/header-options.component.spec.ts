import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderOptionsComponent } from './header-options.component';
import { configureTestSuite } from 'ng-bullet';
import { ResponsiveModule } from 'ngx-responsive';
import { take } from 'rxjs/operators';
describe('HeaderOptionsComponent', () => {
  let component: HeaderOptionsComponent;
  let fixture: ComponentFixture<HeaderOptionsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderOptionsComponent],
      imports: [ResponsiveModule.forRoot()]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderOptionsComponent);
    component = fixture.componentInstance;
    component.isOptionShown = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hideOption() - should emit the event for hiding to option', done => {
    component.hideOptionEvent.subscribe((value) => {
      expect(value).toEqual(false);
      done();
    });
    component.hideOption();
  });

  describe('saveAsTemplate()', () => {
    it('should emit the saveAsTemplateEvent', done => {
      component.saveAsTemplateEvent.pipe(take(1)).subscribe(() => done());
      component.saveAsTemplate();
    });
    it('should emit the event for hiding to option', done => {
      component.hideOptionEvent.subscribe((value) => {
        expect(value).toEqual(false);
        done();
      });
      component.saveAsTemplate();
    });
  });
});
