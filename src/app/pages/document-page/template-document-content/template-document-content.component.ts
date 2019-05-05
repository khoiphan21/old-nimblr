import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlockId } from 'src/app/classes/block/block';
import { UUID } from 'src/app/services/document/command/document-command.service';
import { CreateBlockEvent } from '../../../components/block/createBlockEvent';

@Component({
  selector: 'app-template-document-content',
  templateUrl: './template-document-content.component.html',
  styleUrls: ['./template-document-content.component.scss']
})
export class TemplateDocumentContentComponent implements OnInit {

  @Input() blockIds: Array<string>;
  @Input() isUserLoggedIn: boolean;
  @Input() focusBlockId: BlockId;
  @Input() submissionDocIds: Array<UUID>;
  @Input() isChildDoc: boolean;

  @Output() addNewBlockEvent = new EventEmitter<CreateBlockEvent>();
  @Output() deleteBlockEvent = new EventEmitter<string>();
  @Output() navigateToChildEvent = new EventEmitter<UUID>();
  @Output() showInviteEvent = new EventEmitter<boolean>();
  @Output() updateDocumentEvent = new EventEmitter<Array<string>>();

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

  showInvite() {
    this.showInviteEvent.emit(true);
  }

  navigateToChild(id: UUID) {
    this.navigateToChildEvent.emit(id);
  }
  updateDocument(blockIds: Array<string>) {
    this.updateDocumentEvent.emit(blockIds);
  }
}
