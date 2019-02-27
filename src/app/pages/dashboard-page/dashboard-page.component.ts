import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document/document.service';
import { Document } from '../../classes/document';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  userDocuments: Document[];

  constructor(
    private documentService: DocumentService,
    private router: Router
  ) { }

  ngOnInit() {
    this.documentService.getUserDocuments$().subscribe(documents => {
      this.userDocuments = documents;
    });
  }

  createNewFormDocument() {
    this.documentService.createFormDocument();
    this.router.navigate(['/document']);
  }

}
