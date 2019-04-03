import { Component, OnInit, Input } from '@angular/core';
import { Document } from 'src/app/classes/document';
import { User } from 'src/app/classes/user';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DocumentQueryService } from 'src/app/services/document/query/document-query.service';
import { BlockFactoryService, CreateNewBlockInput } from '../../services/block/factory/block-factory.service';
import { BlockType, SharingStatus, UpdateDocumentInput } from 'src/API';
import { AccountService } from '../../services/account/account.service';
import { BlockQueryService } from '../../services/block/query/block-query.service';
import { BlockCommandService } from '../../services/block/command/block-command.service';
import { DocumentCommandService } from '../../services/document/command/document-command.service';
import { BlockId, Block } from 'src/app/classes/block/block';
import { TextBlock } from 'src/app/classes/block/textBlock';

const uuidv4 = require('uuid/v4');

@Component({
  selector: 'app-document-page',
  templateUrl: './document-page.component.html',
  styleUrls: ['./document-page.component.scss']
})
export class DocumentPageComponent implements OnInit {
  isUserLoggedIn: boolean;
  isPlaceholderShown: boolean;
  docTitle: string;
  currentSharingStatus: SharingStatus;

  currentDocument: Document;
  blockIds: Array<string>;

  private document$: Observable<Document>;
  private currentUser: User;
  private timeout: any;

  focusBlockId: BlockId; // the block that needs to be focused on after creation

  @Input() block: TextBlock;

  constructor(
    private documentQueryService: DocumentQueryService,
    private documentCommandService: DocumentCommandService,
    private blockCommandService: BlockCommandService,
    private blockQueryService: BlockQueryService,
    private blockFactoryService: BlockFactoryService,
    private accountService: AccountService,
    private route: ActivatedRoute
  ) { }

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

  /**
   * Create a new block and add it to the list of blocks in the document
   *
   * @param type the type of the new block to be added
   * @param after after a certain block. If not specified or invalid, the new
   *              block will be added to the end of the array
   */
  async addNewBlock(type: BlockType, after?: BlockId): Promise<Block> {
    try {
      // create a new block object
      let block: Block;
      const input: CreateNewBlockInput = {
        documentId: this.currentDocument.id,
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
      // create a new block in backend with BlockCommandService
      await this.blockCommandService.createBlock(block);
      // Update the block to be focused on
      this.focusBlockId = block.id;
      // update the list of block IDs to be displayed
      if (after && this.blockIds.indexOf(after) !== -1) {
        const index = this.blockIds.indexOf(after) + 1;
        this.blockIds.splice(index, 0, block.id);
      } else {
        this.blockIds.push(block.id);
      }
      // Update the document in the backend
      await this.documentCommandService.updateDocument({
        id: this.currentDocument.id,
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

}
