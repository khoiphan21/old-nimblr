import { Component, OnInit } from '@angular/core';
import { UUID } from 'src/app/services/document/command/document-command.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-document-page',
  templateUrl: './document-page.component.html',
  styleUrls: ['./document-page.component.scss'],
})
export class DocumentPageComponent implements OnInit {

  constructor(
    private router: Router,
  ) {}

  ngOnInit() {}

  navigateToChildDocument(parentID: UUID, childID: UUID) {
    this.router.navigate([`document/${parentID}`, childID]);
  }
}
