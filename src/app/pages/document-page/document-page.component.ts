import { Component, OnInit } from '@angular/core';
import { Document } from 'src/app/classes/document';
import { User } from 'src/app/classes/user';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DocumentQueryService } from 'src/app/services/document/document-query.service';

@Component({
  selector: 'app-document-page',
  templateUrl: './document-page.component.html',
  styleUrls: ['./document-page.component.scss']
})
export class DocumentPageComponent implements OnInit {

  private currentDocument: Document;
  private document$: Observable<Document>;
  private currentUser: User;
  private blockIds: Array<string>;

  constructor(
    private documentQueryService: DocumentQueryService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.documentService.getCurrentDocument$().subscribe(document => {
    //   this.currentDocument = document;
    // });
    this.document$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.documentQueryService.getDocument$(params.get('id')))
    );
    this.document$.subscribe(document => {
      // this.blockIds = document.
      console.log('document retrieved: ', document);
    });
  }

}
