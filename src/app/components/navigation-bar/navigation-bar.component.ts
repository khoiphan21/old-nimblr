import { Component, OnInit, Input } from '@angular/core';
import { NavigationBarService } from '../../services/navigation-bar/navigation-bar.service';
import { NavigationTabDocument } from '../../classes/navigation-tab';
import { slideLeftToRightAnimation, fadeInOutAnimation } from 'src/app/animation';
import { User } from 'src/app/classes/user';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  animations: [slideLeftToRightAnimation, fadeInOutAnimation]
})
export class NavigationBarComponent implements OnInit {
  @Input() documentId: string;

  currentUser: User;
  initialName: string;
  isNavigationTabShown = false;
  navigationTabs: NavigationTabDocument[] = [];

  constructor(
    private navigationBarService: NavigationBarService,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    // this.navigationBarService.getNavigationBarStatus$().subscribe(status => {
    //   this.isNavigationTabShown = status;
    // });
    // this.navigationBarService.getNavigationBar$(this.documentId).subscribe((navigationTabs: NavigationTabDocument[]) => {
    //   this.navigationTabs = [];
    //   for (const navigationTab of navigationTabs) {
    //     this.navigationTabs.push(navigationTab);
    //   }
    // });
    // this.accountService.getUser$().subscribe((user) => {
    //   if (user !== null) {
    //     this.currentUser = user;
    //     const firstName = user.firstName;
    //     this.processInitialName(firstName);
    //   }
    // });
  }

  private processInitialName(fName: string) {
    this.initialName = fName.charAt(0);
  }

}
