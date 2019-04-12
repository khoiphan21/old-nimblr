import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UUID } from '../../../../services/document/command/document-command.service';
import { DocumentQueryService } from '../../../../services/document/query/document-query.service';
import { SubmissionDocument } from '../../../../classes/document/submissionDocument';

@Component({
  selector: 'app-submission-recipient',
  templateUrl: './submission-recipient.component.html',
  styleUrls: ['./submission-recipient.component.scss']
})
export class SubmissionRecipientComponent implements OnInit {

  recipientEmail: string;

  // flag to control when all details are ready for rendering
  isRecipientReady: boolean;

  @Input() documentId: UUID; // The id of the submission document

  @Output() navigateToEvent = new EventEmitter<UUID>();

  constructor(
    private queryService: DocumentQueryService
  ) { }

  ngOnInit() {
    this.queryService.getDocument$(this.documentId).subscribe((document: SubmissionDocument) => {
      this.storeDocumentContent(document);
    });
  }

  storeDocumentContent(document: SubmissionDocument) {
    if (document === null) { return; }
    // now store relevant details for rendering
    this.recipientEmail = document.recipientEmail;

    // Finally set the flag to be ready
    this.isRecipientReady = true;
  }

  navigate() {
    this.navigateToEvent.emit(this.documentId);
  }

}
