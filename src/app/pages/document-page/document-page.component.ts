import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Document } from 'src/app/classes/document';
import { User } from 'src/app/classes/user';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DocumentQueryService } from 'src/app/services/document/query/document-query.service';
import { BlockFactoryService } from '../../services/block/factory/block-factory.service';
import { BlockType, SharingStatus, UpdateDocumentInput, DeleteBlockInput } from 'src/API';
import { AccountService } from '../../services/account/account.service';
import { BlockQueryService } from '../../services/block/query/block-query.service';
import { BlockCommandService } from '../../services/block/command/block-command.service';
import { DocumentCommandService } from '../../services/document/command/document-command.service';
import { TextBlock } from 'src/app/classes/block';
import { isNull } from 'util';

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
  private document$: Observable<Document>;
  private currentUser: User;
  private timeout: any;

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

  deleteBlock(blockId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        // update document, hashmap:
        this.blockQueryService.deleteBlockCreatedByUI(blockId);

        // Update Document current Document
        let blockIds = this.currentDocument.blockIds;
        const index = blockIds.indexOf(blockId);
        blockIds.splice(index, 1);
        this.currentDocument.version = uuidv4();
        this.currentDocument.lastUpdatedBy = this.currentUser.id;
        const updatePromise = this.documentCommandService.updateDocument(this.currentDocument);

        // call command service
        let input: DeleteBlockInput;
        input = { id: blockId };
        const blockPromise = this.blockCommandService.deleteBlock(input);

        // Await for all the promises before moving on
        await updatePromise;
        await blockPromise;
        resolve();

      } catch (error) {
        const message = `DocumentPage failed to delete block: ${error.message}`;
        reject(new Error(message));

      }
    });
  }

  deleteBlockByKey(blockId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        // focus cursor to block above
        const blockIds = this.currentDocument.blockIds;
        const currentIndex = blockIds.indexOf(blockId);
        const previousInputBlockId = blockIds[currentIndex - 1];
        const textbox: HTMLElement = document.getElementById(previousInputBlockId);
        console.log("TCL: DocumentPageComponent -> deleteBlockByKey -> textbox", textbox)
        // textbox.focus();

        // perform block deletion
        await this.deleteBlock(blockId);
        resolve();

      } catch (error) {
        reject('Nothing can be focus: ' + error.message);
      }
    });
  }

  // private focusOnElement(htmlElement: HTMLElement, position: number = -1) {
  //   /*
  //   This method place cursor on a specific position. By default it places cursor
  //   after the last character (-1).
  //   */
  //   const range = document.createRange();
  //   const seletion = window.getSelection();
  //   const inputFirstLine = htmlElement.childNodes[0];

  //   const findPosition = input => {
  //     if (isNull(input)) {
  //       return 0;
  //     } else {
  //       return input.nodeValue.length;
  //     }
  //   };

  //   if (position === -1) {
  //     range.setStart(inputFirstLine, findPosition(inputFirstLine));
  //   } else {
  //     range.setStart(inputFirstLine, position);
  //   }

  //   range.collapse(true);
  //   seletion.removeAllRanges();
  //   seletion.addRange(range);
  // }
}
