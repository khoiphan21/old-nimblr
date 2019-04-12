import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Document } from 'src/app/classes/document/document';
import { User } from 'src/app/classes/user';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DocumentQueryService } from 'src/app/services/document/query/document-query.service';
import { BlockFactoryService, CreateNewBlockInput } from '../../../services/block/factory/block-factory.service';
import { BlockType, DocumentType, SharingStatus, UpdateDocumentInput, DeleteBlockInput } from 'src/API';
import { AccountService } from '../../../services/account/account.service';
import { BlockQueryService } from '../../../services/block/query/block-query.service';
import { BlockCommandService } from '../../../services/block/command/block-command.service';
import { DocumentCommandService, UUID } from '../../../services/document/command/document-command.service';
import { BlockId, Block } from 'src/app/classes/block/block';
import { TextBlock } from 'src/app/classes/block/textBlock';
import { fadeInOutAnimation } from 'src/app/animation';
import { Location } from '@angular/common';
import { VersionService } from 'src/app/services/version/version.service';
import { CreateBlockEvent } from 'src/app/components/block/block.component';
import { SubmissionDocument } from 'src/app/classes/document/submissionDocument';
import { DocumentFactoryService } from 'src/app/services/document/factory/document-factory.service';
import { EmailService } from 'src/app/services/email/email.service';
import { TemplateDocument } from '../../../classes/document/templateDocument';

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
  currentSharingStatus: SharingStatus;
  // currentTab = 'template';
  private document$: Observable<Document>;
  private currentUser: User;
  private timeout: any;

  // Properties needed from the readonly Document received
  documentId: string;
  documentType: DocumentType;
  docTitle: string;
  blockIds: Array<string> = [];
  isDocumentReady = false; // should be switched to true when document is loaded
  submissionDocIds: Array<UUID> = [];

  focusBlockId: BlockId; // the block that needs to be focused on after creation

  @Input() block: TextBlock;

  constructor(
    private documentQueryService: DocumentQueryService,
    private documentCommandService: DocumentCommandService,
    private docFactoryService: DocumentFactoryService,
    private blockCommandService: BlockCommandService,
    private blockQueryService: BlockQueryService,
    private blockFactoryService: BlockFactoryService,
    private versionService: VersionService,
    private emailService: EmailService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
  }

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
    // Initialize internal values
    this.docTitle = '';
    this.blockIds = [];
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
    this.document$.subscribe((document: Document) => {
      if (document === null) { return; }
      this.checkIsChildDocument();

      if (!this.versionService.isRegistered(document.version)) {
        this.updateStoredProperties(document);
      }

      // now set the flag for document ready to be true for rendering
      this.isDocumentReady = true;

      this.setupBlockUpdateSubscription();
    }, error => {
      console.error(`DocumentPage failed to get document: ${error.message}`);
    });

  }

  private updateStoredProperties(document: Document) {
    // Update the values to be used in rendering
    this.documentId = document.id;
    this.documentType = document.type;
    this.blockIds = document.blockIds;
    this.docTitle = document.title;
    this.currentSharingStatus = document.sharingStatus;
    // For submission documents
    const template = document as TemplateDocument;
    this.submissionDocIds = template.submissionDocIds ? template.submissionDocIds : [];
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
    this.blockQueryService.subscribeToUpdate(this.documentId);
  }


  /**
   * Create a new block and add it to the list of blocks in the document
   *
   * @param type the type of the new block to be added
   * @param after after a certain block. If not specified or invalid, the new
   *              block will be added to the end of the array
   */
  async addNewBlock(event: CreateBlockEvent): Promise<Block> {
    const type = event.type;
    const after = event.id;
    try {
      // create a new block object
      let block: Block;
      const input: CreateNewBlockInput = {
        documentId: this.documentId,
        lastUpdatedBy: this.currentUser.id
      };

      switch (type) {
        case BlockType.TEXT:
          block = this.blockFactoryService.createNewTextBlock(input);
          break;
        case BlockType.QUESTION:
          block = this.blockFactoryService.createNewQuestionBlock(input);
          break;
        default:
          throw Error(`BlockType "${type}" is not supported`);
      }
      // register it to the BlockQueryService so that the backend notification
      // will be ignored
      this.blockQueryService.registerBlockCreatedByUI(block);

      // Update the block to be focused on
      this.focusBlockId = block.id;
      // update the list of block IDs to be displayed
      if (after && this.blockIds.indexOf(after) !== -1) {
        const index = this.blockIds.indexOf(after) + 1;
        this.blockIds.splice(index, 0, block.id);
      } else {
        this.blockIds.push(block.id);
      }
      // create a new block in backend with BlockCommandService
      await this.blockCommandService.createBlock(block);
      // Update the document in the backend
      await this.documentCommandService.updateDocument({
        id: this.documentId,
        lastUpdatedBy: this.currentUser.id,
        blockIds: this.blockIds
      });

      return block;
    } catch (error) {
      throw new Error(`DocumentPage failed to add block: ${error}`);
    }
  }

  async updateDocTitle(limit = 500): Promise<any> {

    return new Promise((resolve, reject) => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        const version = uuidv4();

        const input: UpdateDocumentInput = {
          id: this.documentId,
          version,
          lastUpdatedBy: this.currentUser.id,
          title: this.docTitle
        };

        this.documentCommandService.updateDocument(input).then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      }, limit);
    });
  }

  changeSharingStatus(status: SharingStatus) {
    this.currentSharingStatus = status;

    this.documentCommandService.updateDocument({
      id: this.documentId,
      sharingStatus: this.currentSharingStatus,
      lastUpdatedBy: this.currentUser.id
    });
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
        parent: this.documentId,
        child: docID
      });
  }

  backToParent() {
    if (this.isChildDoc === true) {
      this.location.back();
    }
  }

  async deleteBlock(blockId: string) {
    try {
      // update document, hashmap:
      this.blockQueryService.registerBlockDeletedByUI(blockId);

      // Update Document current Document
      const blockIds = this.blockIds;
      const index = blockIds.indexOf(blockId);
      blockIds.splice(index, 1);
      // Now move the focus on the previous block
      // The uuidv4() call is needed to make sure it changes
      this.focusBlockId = `${blockIds[index - 1]}-${uuidv4()}`;

      const updatePromise = this.documentCommandService.updateDocument({
        id: this.documentId,
        blockIds: this.blockIds,
        lastUpdatedBy: this.currentUser.id
      });
      // call command service
      let input: DeleteBlockInput;
      input = { id: blockId };
      const blockPromise = this.blockCommandService.deleteBlock(input);

      // Await for all the promises before moving on
      await updatePromise;
      await blockPromise;

    } catch (error) {
      const message = `DocumentPage failed to delete block: ${error.message}`;
      throw new Error(message);
    }
  }

  async saveAsTemplate() {
    // update the stored document type
    this.documentType = DocumentType.TEMPLATE;

    // send update for the document's type to GraphQL
    const input: UpdateDocumentInput = {
      id: this.documentId,
      lastUpdatedBy: this.currentUser.id,
      type: DocumentType.TEMPLATE
    };

    await this.documentCommandService.updateDocument(input);
  }

  async sendDocument(email: string) {
    // First duplicate all blocks
    const blocks: Array<Block> = await Promise.all(
      this.blockIds.map(id => this.getCurrentBlock(id))
    );
    const duplicatedBlocks = await this.blockCommandService.duplicateBlocks(blocks);
    const duplicatedIds = duplicatedBlocks.map(block => block.id);

    // create a new SubmissionDocument, passing in the info + blocks
    const submission: SubmissionDocument = this.docFactoryService.createNewSubmission({
      ownerId: this.currentUser.id,
      recipientEmail: email,
      blockIds: duplicatedIds,
      title: this.docTitle
    });

    // call createDocument for the new document
    await this.documentCommandService.createDocument(submission);

    // update the list of submissionDocIds
    this.submissionDocIds.push(submission.id);

    // call to updateDocument for current document
    await this.documentCommandService.updateDocument({
      id: this.documentId,
      submissionDocIds: this.submissionDocIds,
      lastUpdatedBy: this.currentUser.id
    });

    // if all good, then send the email
    await this.emailService.sendInvitationEmail({
      email,
      documentId: submission.id,
      sender: this.currentUser
    });
  }

  private async getCurrentBlock(id: BlockId): Promise<Block> {
    return new Promise(resolve => {
      this.blockQueryService.getBlock$(id).pipe(take(1)).subscribe(value => {
        resolve(value);
      });
    });
  }

}
