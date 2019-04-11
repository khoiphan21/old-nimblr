import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavigationTabDocument } from 'src/app/classes/navigation-tab';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navigation-tab',
  templateUrl: './navigation-tab.component.html',
  styleUrls: ['./navigation-tab.component.scss']
})
export class NavigationTabComponent implements OnInit {
  isCurrentDocument = false;
  isQuestionOptionShown = false;
  @Input() navigationTab: NavigationTabDocument;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    const url = this.router.url;
    this.checkCurrentUrl(url);
    this.router.events.subscribe((value) => {
      if (value instanceof NavigationEnd) {
        this.checkCurrentUrl(value.url);
      }
    });
  }

  private checkCurrentUrl(url) {
    if (url.includes(this.navigationTab.id)) {
      this.isCurrentDocument = true;
    } else {
      this.isCurrentDocument = false;
    }
  }

  navigateToDocument(docId: string) {
    this.router.navigate([`/document`, docId]);
  }
}
