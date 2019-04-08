import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendFormComponent } from './send-form.component';
import { ResponsiveModule } from 'ngx-responsive';
describe('SendFormComponent', () => {
  let component: SendFormComponent;
  let fixture: ComponentFixture<SendFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendFormComponent ],
      imports: [ResponsiveModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendFormComponent);
    component = fixture.componentInstance;
    component.isSendFormShown = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hideContainer() - should change the value to false', () => {
    component.hideSendFormEvent.subscribe(data => {
      expect(data).toBe(false);
    });
    component.hideContainer();
});
});
