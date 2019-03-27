import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/animation';

@Component({
  selector: 'app-header-sharing',
  templateUrl: './header-sharing.component.html',
  styleUrls: ['./header-sharing.component.scss'],
  animations: [fadeInOutAnimation]
})
export class HeaderSharingComponent implements OnInit {
  @Input() isSharingShown: boolean;
  @Output() hideSharingEvent = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  hideSharing() {
    this.hideSharingEvent.emit(false);
  }

  copyPageLink() {

  }

  toggleSharing(event: Event) {
    event.stopPropagation();
  }

}
