import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Document } from 'src/app/classes/document';

@Component({
  selector: 'app-document-card',
  templateUrl: './document-card.component.html',
  styleUrls: ['./document-card.component.scss']
})
export class DocumentCardComponent implements OnInit {

  title: string;

  @Input() document: Document;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.title = this.document.title ? this.document.title : 'Untitled';
  }

  navigateToDocument() {
    this.router.navigate(['/document', this.document.id]);
  }

}
