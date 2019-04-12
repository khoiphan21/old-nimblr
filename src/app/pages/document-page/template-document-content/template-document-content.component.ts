import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlockId } from 'src/app/classes/block/block';
import { CreateBlockEvent } from 'src/app/components/block/block.component';
import { UUID } from 'src/app/services/document/command/document-command.service';

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

  @Output() addNewBlockEvent = new EventEmitter<CreateBlockEvent>();
  @Output() deleteBlockEvent = new EventEmitter<string>();
  @Output() navigateToChildEvent = new EventEmitter<UUID>();

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

  navigateToChild(id: UUID) {
    this.navigateToChildEvent.emit(id);
  }
}
