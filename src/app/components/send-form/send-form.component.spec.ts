import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendFormComponent } from './send-form.component';
import { ResponsiveModule } from 'ngx-responsive';
import { FormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

describe('SendFormComponent', () => {
  let component: SendFormComponent;
  let fixture: ComponentFixture<SendFormComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SendFormComponent],
      imports: [
        ResponsiveModule.forRoot(),
        FormsModule
      ]
    })
      .compileComponents();
  });

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
      component.recipientList = ['abcd'];
      component.sendEmailEvent.subscribe(value => {
        expect(value).toEqual(component.recipientList);
        done();
      });
      component.send();
    });
    it('should call hideContainer()', () => {
      spyOn(component, 'hideContainer');
      component.send();
      expect(component.hideContainer).toHaveBeenCalled();
    });
    it('should call to clear the input', () => {
      spyOn(component, 'clearList');
      component.send();
      expect(component.clearList).toHaveBeenCalled();
    });
  });

  describe('clearInput()', () => {
    it('should clear the recipientInput', () => {
      component.recipientInput = 'test';
      component.clearInput();
      expect(component.recipientInput).toEqual('');
    });
  });

  it('should add the selected recipient into the list', () => {
    const recipient = 'test@gmail.com';
    component.recipientInput = recipient;
    component['addRecipient']();
    expect(component.recipientList[0]).toBe(recipient);
  });

  describe('deleteRecipient()', () => {
    let removeRecipientSpy: jasmine.Spy;
    beforeEach(() => {
      removeRecipientSpy = spyOn(component, 'removeRecipientFromList');
    });

    it('should not call removeRecipientFromList() if the string is not empty', () => {
      component.recipientList = ['test'];
      component.recipientInput = 'test';
      component['deleteRecipient']();
      expect(removeRecipientSpy).not.toHaveBeenCalled();
    });

    it('should not call removeRecipientFromList() if the recipientList is empty', () => {
      component.recipientList = [];
      component.recipientInput = '';
      component['deleteRecipient']();
      expect(removeRecipientSpy).not.toHaveBeenCalled();
    });

    it('should remove the last recipient in the list', () => {
      component.recipientList = ['test'];
      component.recipientInput = '';
      component['deleteRecipient']();
      expect(removeRecipientSpy).toHaveBeenCalledWith(0);
    });
  });

  it('removeRecipientFromList() - should remove the right recipient in the list', () => {
    component.recipientList = ['test 1', 'test 2'];
    component.removeRecipientFromList(0);
    expect(component.recipientList[0]).toEqual('test 2');
  });

});
