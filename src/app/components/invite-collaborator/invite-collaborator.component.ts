import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { fadeInOutAnimation, slideBottomToTopAnimation } from 'src/app/animation';

@Component({
  selector: 'app-invite-collaborator',
  templateUrl: './invite-collaborator.component.html',
  styleUrls: ['./invite-collaborator.component.scss'],
  animations: [fadeInOutAnimation, slideBottomToTopAnimation]
})
export class InviteCollaboratorComponent implements OnInit {
  @Input() isInviteCollaboratorShown: boolean;
  @Output() hideInviteCollaborateEvent = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  hideContainer() {
    this.hideInviteCollaborateEvent.emit(false);
  }

}
