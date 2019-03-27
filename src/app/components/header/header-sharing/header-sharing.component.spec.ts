import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSharingComponent } from './header-sharing.component';

describe('HeaderSharingComponent', () => {
  let component: HeaderSharingComponent;
  let fixture: ComponentFixture<HeaderSharingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderSharingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
