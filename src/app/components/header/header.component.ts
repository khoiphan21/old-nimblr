import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationBarService } from 'src/app/services/navigation-bar/navigation-bar.service';
import { SharingStatus } from 'src/API';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUrl: string;
  initialName: string;
  isOptionShown = false;
  isSharingShown = false;

  @Input() sharingStatus: SharingStatus;
  @Output() sharingChange = new EventEmitter<SharingStatus>();
  @Output() showInviteEvent = new EventEmitter<boolean>();

  constructor(
    private navigationBarService: NavigationBarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.navigationBarService.setNavigationBarStatus(false);
    this.manageHeaderContent(this.router.url);
  }

  private manageHeaderContent(url: string) {
    if (url === '/dashboard') {
      this.currentUrl = 'dashboard';
    } else {
      this.currentUrl = 'document';
    }
  }

  showNavigationBar() {
    this.navigationBarService.setNavigationBarStatus(true);
  }

  showInvite() {
    this.showInviteEvent.emit(true);
  }

  changeSharingStatus(status: SharingStatus) {
    this.sharingChange.emit(status);
  }
}
