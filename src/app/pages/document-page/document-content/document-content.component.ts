import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Document } from 'src/app/classes/document';
import { User } from 'src/app/classes/user';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DocumentQueryService } from 'src/app/services/document/query/document-query.service';
import { BlockFactoryService, CreateNewBlockInput } from '../../../services/block/factory/block-factory.service';
import { BlockType, SharingStatus, UpdateDocumentInput, DeleteBlockInput, TextBlockType } from 'src/API';
import { AccountService } from '../../../services/account/account.service';
import { BlockQueryService } from '../../../services/block/query/block-query.service';
import { BlockCommandService } from '../../../services/block/command/block-command.service';
import { DocumentCommandService, UUID } from '../../../services/document/command/document-command.service';
import { BlockId, Block } from 'src/app/classes/block/block';
import { TextBlock } from 'src/app/classes/block/textBlock';
import { fadeInOutAnimation } from 'src/app/animation';
import { Location } from '@angular/common';
import { balancePreviousStylesIntoKeyframes } from '@angular/animations/browser/src/util';
import { CreateBlockInfo } from 'src/app/components/block/block-option/block-option.component';

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
  docTitle: string;
  currentSharingStatus: SharingStatus;
  currentTab = 'template';
  currentDocument: Document;
  private document$: Observable<Document>;
  private currentUser: User;
  private timeout: any;

  blockIds: Array<string>;

  focusBlockId: BlockId; // the block that needs to be focused on after creation

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
    this.document$.subscribe(document => {
      if (document === null) { return; }
      this.currentDocument = document;
      this.checkIsChildDocument();

      // Update the list of block ids
      this.blockIds = this.currentDocument.blockIds;

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


  /**
   * Create a new block and add it to the list of blocks in the document
   *
   * @param type the type of the new block to be added
   * @param after after a certain block. If not specified or invalid, the new
   *              block will be added to the end of the array
   */
  async addNewBlock(blockInfo: CreateBlockInfo, after?: BlockId): Promise<Block> {
    try {
      // create a new block object
      let block: Block;
      const input: CreateNewBlockInput = {
        documentId: this.currentDocument.id,
        lastUpdatedBy: this.currentUser.id
      };

      switch (blockInfo.type) {
        case BlockType.TEXT:
          block = this.createAndSelectTextBlock(blockInfo.textblocktype, input);
          break;
        case BlockType.QUESTION:
          block = this.blockFactoryService.createNewQuestionBlock(input);
          break;
        default:
          throw Error(`BlockType "${blockInfo.type}" is not supported`);
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
      const createBlockPromise = await this.blockCommandService.createBlock(block);
      // Update the document in the backend
      const updateDocPromise = await this.documentCommandService.updateDocument({
        id: this.currentDocument.id,
        lastUpdatedBy: this.currentUser.id,
        blockIds: this.blockIds
      });

      // await createBlockPromise;
      // await updateDocPromise;

      return block;
    } catch (error) {
      throw new Error(`DocumentPage failed to add block: ${error}`);
    }
  }

  private createAndSelectTextBlock(textblocktype, input) {
    // TODO: @bruno tbt
    switch (textblocktype) {
      case TextBlockType.HEADER:
        return this.blockFactoryService.createNewHeaderBlock(input);
      default:
        return this.blockFactoryService.createNewTextBlock(input);
    }
  }

  async updateDocTitle(limit = 500): Promise<any> {

    return new Promise((resolve, reject) => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        const input: UpdateDocumentInput = {
          id: this.currentDocument.id,
          lastUpdatedBy: this.currentUser.id,
          title: this.docTitle
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
      // Update the version
      this.currentDocument.blockIds = this.blockIds;
      this.currentDocument.lastUpdatedBy = this.currentUser.id;
      const updatePromise = this.documentCommandService.updateDocument(this.currentDocument);

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

}
