import { Component, OnInit } from '@angular/core';
import { Document } from 'src/app/classes/document';
import { User } from 'src/app/classes/user';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DocumentQueryService } from 'src/app/services/document/query/document-query.service';
import { BlockFactoryService } from '../../services/block/factory/block-factory.service';
import { BlockType, UpdateDocumentInput } from 'src/API';
import { AccountService } from '../../services/account/account.service';
import { BlockQueryService } from '../../services/block/query/block-query.service';
import { BlockCommandService } from '../../services/block/command/block-command.service';
import { DocumentCommandService } from '../../services/document/command/document-command.service';

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

  currentDocument: Document;
  private document$: Observable<Document>;
  private currentUser: User;
  // blockIds: Array<string>;

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
      // this.blockIds = document.blockIds;
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

  async updateValue(): Promise<any> {
    return new Promise((resolve, reject) => {
      const input: UpdateDocumentInput = {
        id: '',
        title: '',
      };
      this.documentCommandService.updateDocument(input).then(() => {

        resolve();
      }).catch(err => {

        reject();
      });
    });
  }

  togglePlaceholder(status: boolean) {
    if (this.docTitle.length > 0 || status === false) {
      this.isPlaceholderShown = false;
    } else {
      this.isPlaceholderShown = true;
    }
  }

}
