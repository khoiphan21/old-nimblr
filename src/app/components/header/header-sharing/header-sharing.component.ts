import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/animation';
import { SharingStatus } from 'src/API';

@Component({
  selector: 'app-header-sharing',
  templateUrl: './header-sharing.component.html',
  styleUrls: ['./header-sharing.component.scss'],
  animations: [fadeInOutAnimation]
})
export class HeaderSharingComponent implements OnInit, OnChanges {
  isPublic: boolean;

  @Input() isSharingShown: boolean;
  @Input() sharingStatus: SharingStatus;

  @Output() hideSharingEvent = new EventEmitter<boolean>();
  @Output() changeSharingStatus = new EventEmitter<SharingStatus>();

  constructor() { }

  ngOnInit() {
    this.checkStatus();
  }

  ngOnChanges(): void {
    this.checkStatus();
  }

  private checkStatus() {
    if (this.sharingStatus === SharingStatus.PUBLIC) {
      this.isPublic = true;
    } else {
      this.isPublic = false;
    }
  }

  hideSharing() {
    this.hideSharingEvent.emit(false);
  }

  copyPageLink() {
    const el = document.createElement('textarea');
    el.value = window.location.href;
    el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px'; // Move outside the screen to make it invisible
    document.body.appendChild(el);
    el.select(); // Select the <textarea> content
    document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);
  }

  toggleSharing() {
    this.isPublic = !this.isPublic;
    if (this.isPublic) {
      this.changeSharingStatus.emit(SharingStatus.PUBLIC);
    } else {
      this.changeSharingStatus.emit(SharingStatus.PRIVATE);
    }
  }

}
