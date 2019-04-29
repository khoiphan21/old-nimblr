import { Injectable } from '@angular/core';
import { DocumentService } from '../document/document.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Document } from '../../classes/document/document';
import { NavigationTabDocument } from '../../classes/navigation-tab';
import { DocumentQueryService } from '../document/query/document-query.service';
import { AccountService } from '../account/account.service';
import { UUID } from '../document/command/document-command.service';
import { TextBlockType } from '../../../API';
import { Block } from '../../classes/block/block';
import { BlockQueryService } from '../block/query/block-query.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationBarService {
  private navigationBar$: BehaviorSubject<Array<NavigationTabDocument>>;
  private documentStructure$: BehaviorSubject<Array<string>>;
  private navigationBarStatus$ = new BehaviorSubject<boolean>(false);

  constructor(
    private documentService: DocumentService,
    private documentQueryService: DocumentQueryService,
    private accountService: AccountService,
    private blockQueryService: BlockQueryService
  ) { }

  getNavigationBarStatus$(): Observable<boolean> {
    return this.navigationBarStatus$;
  }

  setNavigationBarStatus(status: boolean) {
    this.navigationBarStatus$.next(status);
  }

  /**
   * Return an observable for the navigation tabs
   *
   * Will try to get all user documents if logged in, otherwise just get
   * for the document with the given id
   *
   * @param documentId the document id to fall back to if user is not logged in
   */
  getNavigationBar$(): Observable<Array<NavigationTabDocument>> {
    if (!this.navigationBar$) {
      this.navigationBar$ = new BehaviorSubject([]);
      this.getAllUserDocuments();
    }
    return this.navigationBar$;
  }

  private async getAllUserDocuments() {
    return new Promise((resolve, reject) => {
      this.documentService.getUserDocuments$().subscribe(documents => {
        this.processDocuments(documents);
        resolve();
      }, error => {
        this.navigationBar$.error(error);
        reject();
      });
    });
  }

  private processDocuments(documents: Array<any>) {
    const navigationTabs = this.processNavigationTab(documents);
    this.navigationBar$.next(navigationTabs);
  }

  async getForDocument(documentId: string) {
    return new Promise((resolve, reject) => {
      this.documentQueryService.getDocument$(documentId).subscribe(document => {
        if (document === null) { return; }
        this.processDocuments([document]);
        resolve(document);
      }, error => {
        this.navigationBar$.error(error);
        reject();
      });
    });
  }

  processNavigationTab(documents: Array<Document>): Array<NavigationTabDocument> {
    const navigationTabs: Array<NavigationTabDocument> = [];
    for (const document of documents) {
      const id = document.id;
      const title = document.title;
      const type = document.type;
      const children = [];
      const navigationTab = new NavigationTabDocument({id, title, type, children});
      navigationTabs.push(navigationTab);
    }
    return navigationTabs;
  }


  /**
   * Return an observable for the document structures
   *
   * @param documentId the document id to fall back to if user is not logged in
   */
  getDocumentStructure$(documentId: UUID): Observable<Array<string>> {
    if (!this.documentStructure$) {
      this.documentStructure$ = new BehaviorSubject([]);
      this.getTabsForDocument(documentId);
    }
    return this.documentStructure$;
  }

  private async getTabsForDocument(documentId: UUID) {
    return new Promise((resolve, reject) => {
      this.documentQueryService.getDocument$(documentId).subscribe(() => {
        this.blockQueryService.getBlocksForDocument(documentId).then(blocks => {
          const documentStructure = this.processDocumentStructure(blocks);
          this.documentStructure$.next(documentStructure);
          resolve();
        });
      }, error => {
        this.documentStructure$.error(error);
        reject();
      });
    });
  }

  private processDocumentStructure(blocks: Array<Block>): Array<string> {
    const tabs: Array<string> = [];
    const headerBlocks = blocks.filter((block: any) => {
      return block.textBlockType === TextBlockType.HEADER;
    });
    for (const block of headerBlocks) {
      const id = block.id;
      tabs.push(id);
    }
    return tabs;
  }
}
