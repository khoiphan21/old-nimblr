import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlockId } from 'src/app/classes/block/block';
import { UUID } from 'src/app/services/document/command/document-command.service';
import { CreateBlockEvent } from '../../../components/block/createBlockEvent';

@Component({
  selector: 'app-submission-document-content',
  templateUrl: './submission-document-content.component.html',
  styleUrls: ['./submission-document-content.component.scss']
})
export class SubmissionDocumentContentComponent implements OnInit {

  @Input() isChildDoc: boolean;
  @Input() blockIds: Array<string>;
  @Input() isEditable: boolean;
  @Input() focusBlockId: BlockId;
  @Input() submissionDocIds: Array<UUID>;

  @Output() addNewBlockEvent = new EventEmitter<CreateBlockEvent>();
  @Output() deleteBlockEvent = new EventEmitter<string>();

  currentTab = 'template';

  constructor() { }

  ngOnInit() {
  }

  addNewBlock(event: CreateBlockEvent) {
    this.addNewBlockEvent.emit(event);
  }

  deleteBlock(blockId: string) {
    this.deleteBlockEvent.emit(blockId);
  }

}
