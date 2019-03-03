import { Injectable } from '@angular/core';
import { DocumentService } from '../document/document.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Document } from '../../classes/document';
import { NavigationTabDocument } from '../../classes/navigation-tab';

@Injectable({
  providedIn: 'root'
})
export class NavigationBarService {
  private navigationBar$: BehaviorSubject<Array<NavigationTabDocument>>;

  constructor(
    private documentService: DocumentService
  ) { }

  getNavigationBar$(): Observable<Array<NavigationTabDocument>> {
    if (!this.navigationBar$) {
      this.navigationBar$ = new BehaviorSubject([]);
      this.documentService.getUserDocuments$().subscribe((documents) => {
        const navigationTabs = this.processNavigationTab(documents);
        this.navigationBar$.next(navigationTabs);
      });
    }
    return this.navigationBar$;
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
