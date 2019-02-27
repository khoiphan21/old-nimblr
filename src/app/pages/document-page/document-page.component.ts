import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document/document.service';
import { Document } from 'src/app/classes/document';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-document-page',
  templateUrl: './document-page.component.html',
  styleUrls: ['./document-page.component.scss']
})
export class DocumentPageComponent implements OnInit {

  private currentDocument: Document;
  private currentUser: User;

  constructor(
    private documentService: DocumentService,
  ) { }

  ngOnInit() {
    // this.documentService.getCurrentDocument$().subscribe(document => {
    //   this.currentDocument = document;
    // });
  }

}
