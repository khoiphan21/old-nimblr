import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { slideBottomToTopAnimation, fadeInOutAnimation } from 'src/app/animation';

@Component({
  selector: 'app-send-form',
  templateUrl: './send-form.component.html',
  styleUrls: ['./send-form.component.scss'],
  animations: [fadeInOutAnimation, slideBottomToTopAnimation]
})
export class SendFormComponent implements OnInit {
  recipientInput = '';
  recipientList: Array<string> = [];

  @Input() isSendFormShown: boolean;

  @Output() hideSendFormEvent = new EventEmitter<boolean>();
  @Output() sendEmailEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  hideContainer() {
    this.hideSendFormEvent.emit(false);
  }

  send() {
    this.sendEmailEvent.emit(this.recipientInput);
    this.hideContainer();
    this.clearInput();
  }

  clearInput() {
    this.recipientInput = '';
  }

  addRecipient() {
    this.recipientList.push(this.recipientInput);
    this.clearInput();
  }

  deleteRecipient() {
    if (this.recipientInput === '' && this.recipientList.length > 0) {
      const index = this.recipientList.length - 1;
      this.removeRecipientFromList(index);
    }
  }

  removeRecipientFromList(index: number) {
    this.recipientList.splice(index, 1);
  }
}
