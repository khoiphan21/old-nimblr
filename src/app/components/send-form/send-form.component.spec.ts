import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendFormComponent } from './send-form.component';
import { ResponsiveModule } from 'ngx-responsive';
import { FormsModule } from '@angular/forms';

describe('SendFormComponent', () => {
  let component: SendFormComponent;
  let fixture: ComponentFixture<SendFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendFormComponent],
      imports: [
        ResponsiveModule.forRoot(),
        FormsModule
      ]
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

  describe('send()', () => {
    it('should emit the input', done => {
      component.recipientInput = 'abcd';
      component.sendEmailEvent.subscribe(value => {
        expect(value).toEqual(component.recipientInput);
        done();
      });
      component.send();
    });
    it('should call hideContainer()', () => {
      spyOn(component, 'hideContainer');
      component.send();
      expect(component.hideContainer).toHaveBeenCalled();
    });
  });

});
