import { Injectable } from '@angular/core';
import { DocumentService } from '../document/document.service';
import { Observable, Subject } from 'rxjs';
import { Document } from '../../classes/document';
import { NavigationTabDocument } from '../../classes/navigation-tab';

@Injectable({
  providedIn: 'root'
})
export class NavigationBarService {
  navigationBar$: Subject<Array<NavigationTabDocument>> = new Subject();

  constructor(
    private documentService: DocumentService
  ) { }

  getNavigationBar$(): Observable<Array<NavigationTabDocument>> {
     return null;
  }

  updateNavigationBar() {
    
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
