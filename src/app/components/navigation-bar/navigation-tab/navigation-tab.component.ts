import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationTabDocument } from 'src/app/classes/navigation-tab';

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
    private router: Router
  ) { }

  ngOnInit() {
    const url = this.router.url;
    const uuidLength = 36;
    const currentId = url.substring(url.length - uuidLength, url.length);
    if (currentId === this.navigationTab.id) {
      this.isCurrentDocument = true;
    }
  }

  navigateToDocument(docId: string) {
    this.router.navigate([`/document`, docId]);
  }
}
