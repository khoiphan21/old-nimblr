import { Component, OnInit, Input } from '@angular/core';
import { NavigationBarService } from '../../services/navigation-bar/navigation-bar.service';
import { NavigationTabDocument } from '../../classes/navigation-tab';
import { slideLeftToRightAnimation, fadeInOutAnimation } from 'src/app/animation';
import { User } from 'src/app/classes/user';
import { AccountService } from 'src/app/services/account/account.service';
import { DocumentType } from 'src/API';
import { CreateDocumentInput, SharingStatus } from '../../../API';
import { Router } from '@angular/router';
import { DocumentCommandService } from '../../services/document/command/document-command.service';
const uuidv4 = require('uuid/v4');
@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  animations: [slideLeftToRightAnimation, fadeInOutAnimation]
})
export class NavigationBarComponent implements OnInit {
  @Input() documentId;

  currentUser: User;
  initialName: string;
  isNavigationTabShown = false;
  navigationTabs: NavigationTabDocument[] = [];

  constructor(
    private documentCommandService: DocumentCommandService,
    private navigationBarService: NavigationBarService,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit() {
    // TODO FIX THIS ISSUE ABOUT NAVIGATION BAR WHEN USER IS **NOT LOGGED IN**
    this.navigationBarService.getNavigationBarStatus$().subscribe(status => {
      this.isNavigationTabShown = status;
    });
    this.navigationBarService.getNavigationBar$().subscribe((navigationTabs: NavigationTabDocument[]) => {
      // now do a filter
      this.navigationTabs = navigationTabs.filter(tab => {
        return tab.type !== DocumentType.SUBMISSION;
      });
    });
    this.accountService.getUser$().subscribe((user) => {
      if (user !== null) {
        this.currentUser = user;
        const firstName = user.firstName;
        this.processInitialName(firstName);
      }
    });
  }

  private processInitialName(fName: string) {
    this.initialName = fName.charAt(0);
  }

  async createNewDocument() {
    const user = await this.accountService.isUserReady();
    const input: CreateDocumentInput = {
      version: uuidv4(),
      type: DocumentType.GENERIC,
      ownerId: user.id,
      lastUpdatedBy: user.id,
      sharingStatus: SharingStatus.PRIVATE
    };
    const document = await this.documentCommandService.createDocument(input);
    this.router.navigate([`/document/${document.id}`]);
  }

}
