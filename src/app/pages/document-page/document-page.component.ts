import { Component, OnInit } from '@angular/core';
import { Document } from 'src/app/classes/document';
import { User } from 'src/app/classes/user';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DocumentQueryService } from 'src/app/services/document/query/document-query.service';
import { BlockFactoryService } from '../../services/block/factory/block-factory.service';
import { BlockType } from 'src/API';
import { AccountService } from '../../services/account/account.service';
import { BlockQueryService } from '../../services/block/query/block-query.service';
import { BlockCommandService } from '../../services/block/command/block-command.service';
import { DocumentCommandService } from '../../services/document/command/document-command.service';

const uuidv5 = require('uuid/v5');

@Component({
  selector: 'app-document-page',
  templateUrl: './document-page.component.html',
  styleUrls: ['./document-page.component.scss']
})
export class DocumentPageComponent implements OnInit {

  private currentDocument: Document;
  private document$: Observable<Document>;
  private currentUser: User;
  blockIds: Array<string>;

  constructor(
    private documentQueryService: DocumentQueryService,
    private documentCommandService: DocumentCommandService,
    private blockCommandService: BlockCommandService,
    private blockQueryService: BlockQueryService,
    private blockFactoryService: BlockFactoryService,
    private accountService: AccountService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.checkUser().then(user => {
      this.currentUser = user;
      this.retrieveDocumentData();
    }).catch(error => console.error(error));
  }

  checkUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.accountService.getUser$().subscribe(user => {
        if (user) {
          resolve(user);
        }
      }, error => reject(error));
    });
  }

  private retrieveDocumentData() {
    this.document$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.documentQueryService.getDocument$(params.get('id'))
      )
    );
    this.document$.subscribe(document => {
      if (document === null) { return; }
      this.currentDocument = document;
      this.blockIds = document.blockIds;
      this.setupBlockUpdateSubscription();
    }, () => console.error('error getting document in DocumentPage'));
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
      this.currentDocument.version = uuidv5(this.currentDocument.ownerId, this.currentDocument.id);
      this.currentDocument.lastUpdatedBy = this.currentUser.id;
      // send update command to DocumentCommandService
      this.documentCommandService.updateDocument(this.currentDocument);
    } catch (error) {
      this.printAddBlockError(error);
    }
  }

  private printAddBlockError(error) {
    console.error('DocumentPage unable to add block');
    console.error(error);
    throw(error);
  }

}
