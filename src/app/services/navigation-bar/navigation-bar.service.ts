import { Injectable } from '@angular/core';
import { DocumentService } from '../document/document.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Document } from '../../classes/document';
import { NavigationTabDocument } from '../../classes/navigation-tab';
import { DocumentQueryService } from '../document/query/document-query.service';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationBarService {
  private navigationBar$: BehaviorSubject<Array<NavigationTabDocument>>;
  private navigationBarStatus$ = new BehaviorSubject<boolean>(false);

  constructor(
    private documentService: DocumentService,
    private documentQueryService: DocumentQueryService,
    private accountService: AccountService
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
  getNavigationBar$(documentId?: string): Observable<Array<NavigationTabDocument>> {
    if (!this.navigationBar$) {
      this.navigationBar$ = new BehaviorSubject([]);

      this.accountService.isUserReady().then(() => {
        this.getAllUserDocuments();
      }).catch(() => {
        this.getForDocument(documentId);
      });
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

  private async getForDocument(documentId: string) {
    return new Promise((resolve, reject) => {
      this.documentQueryService.getDocument$(documentId).subscribe(document => {
        this.processDocuments([document]);
        resolve();
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
      // currently no header tab implementation
      // const children = this.processChildrenTab();
      const navigationTab = new NavigationTabDocument(id, title, []);
      navigationTabs.push(navigationTab);
    }
    return navigationTabs;
  }
}
