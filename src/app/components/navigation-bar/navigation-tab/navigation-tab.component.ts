import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavigationTabDocument } from 'src/app/classes/navigation-tab';
import { Location } from '@angular/common';
import { UUID } from 'src/app/services/document/command/document-command.service';
import { Observable } from 'rxjs';
import { DocumentQueryService } from 'src/app/services/document/query/document-query.service';

@Component({
  selector: 'app-navigation-tab',
  templateUrl: './navigation-tab.component.html',
  styleUrls: ['./navigation-tab.component.scss']
})
export class NavigationTabComponent implements OnInit {
  isCurrentDocument = false;
  isQuestionOptionShown = false;

  title: string;

  documents$: Observable<Document>;

  @Input() documentId: UUID;

  constructor(
    private router: Router,
    private documentQueryService: DocumentQueryService
  ) { }

  ngOnInit() {
    const url = this.router.url;
    this.documentQueryService.getDocument$(this.documentId).subscribe(doc => {
      if (doc === null) { return; }
      this.title = doc.title;
    });
    this.checkCurrentUrl(url);
    this.router.events.subscribe((value) => {
      if (value instanceof NavigationEnd) {
        this.checkCurrentUrl(value.url);
      }
    });
  }

  private checkCurrentUrl(url) {
    if (url.includes(this.documentId)) {
      this.isCurrentDocument = true;
    } else {
      this.isCurrentDocument = false;
    }
  }

  navigateToDocument(docId: string) {
    this.router.navigate([`/document`, docId]);
  }
}
