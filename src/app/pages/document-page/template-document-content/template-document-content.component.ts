import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlockType } from 'src/API';
import { BlockId, Block } from 'src/app/classes/block/block';
import { CreateBlockEvent } from 'src/app/components/block/block.component';

@Component({
  selector: 'app-template-document-content',
  templateUrl: './template-document-content.component.html',
  styleUrls: ['./template-document-content.component.scss']
})
export class TemplateDocumentContentComponent implements OnInit {

  @Input() blockIds: Array<string>;
  @Input() isUserLoggedIn: boolean;

  @Output() addNewBlockEvent = new EventEmitter<CreateBlockEvent>();
  @Output() deleteBlockEvent = new EventEmitter<string>();

  currentTab = 'template';

  constructor() { }

  ngOnInit() {
  }

  /**
   * Create a new block and add it to the list of blocks in the document
   *
   * @param type the type of the new block to be added
   * @param after after a certain block. If not specified or invalid, the new
   *              block will be added to the end of the array
   */
  async addNewBlock(type: BlockType, after?: BlockId): Promise<Block> {
    return;
  }

  async deleteBlock(blockId: string) {

  }
}
