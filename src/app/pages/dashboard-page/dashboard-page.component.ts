import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document/document.service';
import { Document } from '../../classes/document/document';
import { Router } from '@angular/router';
import { DocumentQueryService } from 'src/app/services/document/query/document-query.service';
import { AccountService } from 'src/app/services/account/account.service';
import { DocumentCommandService } from 'src/app/services/document/command/document-command.service';
import { CreateDocumentInput, DocumentType, SharingStatus } from 'src/API';

const uuidv4 = require('uuid/v4');

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  userDocuments: Document[];

  constructor(
    private documentCommandService: DocumentCommandService,
    private documentService: DocumentService,
    private accountService: AccountService,
    private router: Router
  ) { }

  // TODO: handle error
  async ngOnInit() {
    try {
      await this.accountService.isUserReady();
      await this.getDocuments();
    } catch (error) {
      this.router.navigate(['/login']);
    }
  }

  async getDocuments() {
    return new Promise((resolve, reject) => {
      this.documentService.getUserDocuments$().subscribe(documents => {
        this.userDocuments = documents.filter(document => {
          return document.type !== DocumentType.SUBMISSION;
        });
        resolve();
      }, error => {
        const message = `DashboardPage failed to get user documents: ${error.message}`;
        reject(Error(message));
      });
    });
  }

  async createNewDocument() {
    const user = await this.accountService.isUserReady();
    const input: CreateDocumentInput = {
      version: uuidv4(),
      type: DocumentType.TEMPLATE,
      ownerId: user.id,
      lastUpdatedBy: user.id,
      sharingStatus: SharingStatus.PRIVATE
    };
    const document = await this.documentCommandService.createDocument(input);
    this.router.navigate([`/document/${document.id}`]);
  }

}
