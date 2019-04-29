import { Component, OnInit } from '@angular/core';
import { NavigationBarService } from '../../services/navigation-bar/navigation-bar.service';
import { NavigationTabDocument } from '../../classes/navigation-tab';
import { slideLeftToRightAnimation, fadeInOutAnimation } from 'src/app/animation';
import { User } from 'src/app/classes/user';
import { AccountService } from 'src/app/services/account/account.service';
import { DocumentType } from 'src/API';
import { CreateDocumentInput, SharingStatus } from '../../../API';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DocumentCommandService } from '../../services/document/command/document-command.service';
const uuidv4 = require('uuid/v4');

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  animations: [slideLeftToRightAnimation, fadeInOutAnimation]
})
export class NavigationBarComponent implements OnInit {
  currentUser: User;
  initialName: string;
  isNavigationTabShown = false;
  documentStructure: Array<string> = [];
  navigationTabs: NavigationTabDocument[] = [];

  constructor(
    private documentCommandService: DocumentCommandService,
    private navigationBarService: NavigationBarService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.setupNavigationStatus();
    this.setupDocumentStructure();
    await this.setupUser();
    await this.setupNavigationBar();
  }

  private setupNavigationStatus() {
    this.navigationBarService.getNavigationBarStatus$().subscribe(status => {
      this.isNavigationTabShown = status;
    });
  }

  private setupUser(): Promise<any> {
    return new Promise((resolve) => {
      this.accountService.getUser$().subscribe((user) => {
        if (user !== null) {
          this.currentUser = user;
          const firstName = user.firstName;
          this.processInitialName(firstName);
          resolve();
        }
      });
    });
  }

  private processInitialName(fName: string) {
    this.initialName = fName.charAt(0);
  }

  private setupNavigationBar() {
    this.navigationBarService.getNavigationBar$().subscribe((navigationTabs: NavigationTabDocument[]) => {
      this.navigationTabs = navigationTabs.filter(tab => {
        return tab.type !== DocumentType.SUBMISSION;
      });
    });
  }

  private setupDocumentStructure() {
    this.getStructure();
    this.router.events.subscribe((navigation) => {
      if (navigation instanceof NavigationEnd) {
        this.getStructure();
      }
    });
  }

  private getStructure() {
    const documentId = this.route.snapshot.paramMap.get('id');
    this.navigationBarService.getDocumentStructure$(documentId).subscribe((structure) => {
      this.documentStructure = structure;
    });
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
