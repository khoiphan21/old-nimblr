import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../classes/user';
import { AccountService } from '../../services/account/account.service';
import { Router } from '@angular/router';
import { NavigationBarService } from 'src/app/services/navigation-bar/navigation-bar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUrl: string;
  initialName: string;
  isOptionShown = false;
  @Input() currentUser: User;

  constructor(
    private navigationBarService: NavigationBarService,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.navigationBarService.setNavigationBarStatus(false);
    this.accountService.getUser$().subscribe((user) => {
      if (user !== null) {
        this.currentUser = user;
        const firstName = user.firstName;
        this.processInitialName(firstName);
      }
    });
    this.manageHeaderContent(this.router.url);
  }

  private processInitialName(fName: string) {
    this.initialName = fName.charAt(0);
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
}
