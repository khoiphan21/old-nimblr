import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationTabDocument } from 'src/app/classes/navigation-tab';

@Component({
  selector: 'app-navigation-tab',
  templateUrl: './navigation-tab.component.html',
  styleUrls: ['./navigation-tab.component.scss']
})
export class NavigationTabComponent implements OnInit {

  isQuestionOptionShown = false;
  @Input() navigationTab: NavigationTabDocument;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  navigateToDocument(docId: string) {
    this.router.navigate([`/document`, docId]);
  }
}
