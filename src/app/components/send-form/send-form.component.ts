import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { slideBottomToTopAnimation, fadeInOutAnimation } from 'src/app/animation';

@Component({
  selector: 'app-send-form',
  templateUrl: './send-form.component.html',
  styleUrls: ['./send-form.component.scss'],
  animations: [fadeInOutAnimation, slideBottomToTopAnimation]
})
export class SendFormComponent implements OnInit {
  recipientInput: string;

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
  }

}
