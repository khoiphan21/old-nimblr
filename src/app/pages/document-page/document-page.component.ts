import { Component, OnInit } from '@angular/core';
import { UUID } from 'src/app/services/document/command/document-command.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-document-page',
  templateUrl: './document-page.component.html',
  styleUrls: ['./document-page.component.scss'],
})
export class DocumentPageComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.events.subscribe((value) => {
      if (value instanceof NavigationEnd) {
        const documentId = this.route.snapshot.paramMap.get('id');
        localStorage.setItem('lastVisited', documentId);
      }
    });
  }

  navigateToChildDocument(parentID: UUID, childID: UUID) {
    this.router.navigate([`document/${parentID}`, childID]);
  }

}
