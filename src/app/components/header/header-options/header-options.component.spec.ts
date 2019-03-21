import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderOptionsComponent } from './header-options.component';
import { configureTestSuite } from 'ng-bullet';
describe('HeaderOptionsComponent', () => {
  let component: HeaderOptionsComponent;
  let fixture: ComponentFixture<HeaderOptionsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderOptionsComponent ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hideOption() - should emit the event for hiding to option', () => {
    component.hideOptionEvent.subscribe((value) => {
      expect(value).toEqual(false);
    });
    component.hideOption();
  });
});
