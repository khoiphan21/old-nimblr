import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAccessComponent } from './request-access.component';
import { configureTestSuite } from 'ng-bullet';

describe('RequestAccessComponent', () => {
  let component: RequestAccessComponent;
  let fixture: ComponentFixture<RequestAccessComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
