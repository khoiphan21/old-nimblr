import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Document } from 'src/app/classes/document';
import { User } from 'src/app/classes/user';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DocumentQueryService } from 'src/app/services/document/query/document-query.service';
import { BlockFactoryService } from '../../../services/block/factory/block-factory.service';
import { BlockType, SharingStatus, UpdateDocumentInput } from 'src/API';
import { AccountService } from '../../../services/account/account.service';
import { BlockQueryService } from '../../../services/block/query/block-query.service';
import { BlockCommandService } from '../../../services/block/command/block-command.service';
import { DocumentCommandService, UUID } from '../../../services/document/command/document-command.service';
import { TextBlock } from 'src/app/classes/block';
import { fadeInOutAnimation } from 'src/app/animation';
import { Location } from '@angular/common';

const uuidv4 = require('uuid/v4');
@Component({
  selector: 'app-document-content',
  templateUrl: './document-content.component.html',
  styleUrls: ['./document-content.component.scss'],
  animations: [fadeInOutAnimation]
})
export class DocumentContentComponent implements OnInit {
  @Output() navigateToChildDocEvent = new EventEmitter<object>();
  isChildDoc = false;
  isUserLoggedIn: boolean;
  isSendFormShown = false;
  isInviteCollaboratorShown = false;
  isPlaceholderShown: boolean;
  docTitle: string;
  currentSharingStatus: SharingStatus;
  currentTab = 'template';
  currentDocument: Document;
  private document$: Observable<Document>;
  private currentUser: User;
  private timeout: any;

  // blockIds: Array<string>;

  @Input() block: TextBlock;

  constructor(
    private documentQueryService: DocumentQueryService,
    private documentCommandService: DocumentCommandService,
    private blockCommandService: BlockCommandService,
    private blockQueryService: BlockQueryService,
    private blockFactoryService: BlockFactoryService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      this.currentUser = await this.checkUser();
      this.isUserLoggedIn = true;
    } catch {
      this.isUserLoggedIn = false;
    }
    try {
      this.retrieveDocumentData();
    } catch (error) {
      const message = `DocumentPage failed to load: ${error.message}`;
      throw new Error(message);
    }
    // Initialize page display status
    this.docTitle = '';

    this.isPlaceholderShown = true;
  }

  async checkUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.accountService.getUser$().subscribe(user => {
        if (user) {
          resolve(user);
        }
      }, error => {
        reject(Error(`DocumentPage failed to load: ${error.message}`));
      });
    });
  }

  private retrieveDocumentData() {
    // get the id from the route and then retrieve the document observable
    this.document$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.documentQueryService.getDocument$(params.get('id'))
      )
    );
    // subscribe to and process the document from the observable
    this.document$.subscribe(document => {
      if (document === null) { return; }
      this.currentDocument = document;
      this.checkIsChildDocument();
      // added in for edit title
      this.docTitle = document.title;

      // For monitoring sharing status
      this.currentSharingStatus = this.currentDocument.sharingStatus;

      this.setupBlockUpdateSubscription();
    }, error => {
      console.error(`DocumentPage failed to get document: ${error.message}`);
    });
  }

  private checkIsChildDocument() {
    const url = this.router.url;
    const trimmedUrl = url.substring(0, url.length - 37);
    const toBeValidateUrl = trimmedUrl.substr(-8, 8);
    if (toBeValidateUrl === 'document') {
      this.isChildDoc = false;
    } else {
      this.isChildDoc = true;
    }
  }

  private setupBlockUpdateSubscription() {
    // The return result can be ignored (maybe)
    this.blockQueryService.subscribeToUpdate(this.currentDocument.id);
  }

  async addBlock() {
    const block = this.blockFactoryService.createAppBlock({
      documentId: this.currentDocument.id,
      lastUpdatedBy: this.currentUser.id,
      type: BlockType.TEXT
    });
    // register the block with BlockQueryService
    try {
      this.blockQueryService.registerBlockCreatedByUI(block);
      // send create command to BlockCommandService
      await this.blockCommandService.createBlock(block);
      // update document
      this.currentDocument.blockIds.push(block.id);
      this.currentDocument.version = uuidv4();
      this.currentDocument.lastUpdatedBy = this.currentUser.id;
      // send update command to DocumentCommandService
      this.documentCommandService.updateDocument(this.currentDocument);
    } catch (error) {
      const message = `DocumentPage failed to add block: ${error.message}`;
      throw new Error(message);
    }
  }

  async updateDocTitle(limit = 500): Promise<any> {

    return new Promise((resolve, reject) => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        const input: UpdateDocumentInput = {
          id: this.currentDocument.id,
          version: uuidv4(),
          lastUpdatedBy: this.currentUser.id,
          title: this.docTitle,
          updatedAt: new Date().toISOString(),
        };

        // TODO: @khoiphan21 change the update function to automatically create the version
        // so that the user of this service doesn't need to worry about version or other related values
        this.documentCommandService.updateDocument(input).then(data => {
          resolve(input);
        }).catch(err => {
          reject(err);
        });
      }, limit);
    });
  }

  changeSharingStatus(status: SharingStatus) {
    this.currentSharingStatus = status;
    this.currentDocument.sharingStatus = status;
    this.documentCommandService.updateDocument(this.currentDocument);
  }

  showInviteCollaborator() {
    this.isInviteCollaboratorShown = true;
    this.isSendFormShown = false;
  }

  showSendForm() {
    this.isSendFormShown = true;
    this.isInviteCollaboratorShown = false;
  }

  navigateToChildDocument(docID: UUID) {
    this.navigateToChildDocEvent.emit(
      {
        parent: this.currentDocument.id,
        child: docID
      });
  }

  backToParent() {
    if (this.isChildDoc === true) {
      this.location.back();
    }
  }

}
