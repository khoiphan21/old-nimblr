import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlockId } from 'src/app/classes/block/block';
import { CreateBlockEvent } from 'src/app/components/block/block.component';

@Component({
  selector: 'app-template-document-content',
  templateUrl: './template-document-content.component.html',
  styleUrls: ['./template-document-content.component.scss']
})
export class TemplateDocumentContentComponent implements OnInit {

  @Input() blockIds: Array<string>;
  @Input() isUserLoggedIn: boolean;
  @Input() focusBlockId: BlockId;

  @Output() addNewBlockEvent = new EventEmitter<CreateBlockEvent>();
  @Output() deleteBlockEvent = new EventEmitter<string>();
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

  updateDocument(blockIds: Array<string>) {
    this.updateDocumentEvent.emit(blockIds);
  }
}
