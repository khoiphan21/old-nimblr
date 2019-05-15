import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Block, BlockId } from '../../classes/block/block';
import { BlockQueryService } from '../../services/block/query/block-query.service';
import { BlockType, TextBlockType } from 'src/API';
import { VersionService } from 'src/app/services/version/version.service';
import { CreateBlockEvent, BlockTypeAndSubType } from './createBlockEvent';
import { UUID } from '../../services/document/command/document-command.service';
import { TextBlock } from '../../classes/block/textBlock';

export enum BlockStyle {
  HEADER = 'HEADER',
  INPUT = 'INPUT'
}
@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
  block: Block;
  myVersions: Set<UUID> = new Set();
  blockStyle: BlockStyle;

  @Input() blockId: string;
  @Input() isChildDoc: boolean;
  @Input() isEditable: boolean;
  @Input() focusBlockId: BlockId; // To check if it should be focused
  @Output() createBlock = new EventEmitter<CreateBlockEvent>();
  @Output() deleteEvent = new EventEmitter<string>();
  constructor(
    private blockQueryService: BlockQueryService,
    private versionService: VersionService
  ) { }

  ngOnInit() {
    this.blockQueryService.getBlock$(this.blockId).subscribe(block => {
      if (block !== null) {
        // Check if the version is stored
        if (!this.versionService.isRegistered(block.version) || !this.block) {
          // Try to register the received version (in the case of UI-created
          // blocks)
          this.versionService.registerVersion(block.version);
          console.log('changing "block" variable');
          this.block = block;
          this.styleBlock();
        }
      }
    }, error => {
      const newError = new Error(`BlockComponent failed to get block: ${error.message}`);
      // TODO: Handle error in UI
      console.error(newError, this.blockId);
    });
  }

  private styleBlock() {
    if (this.block.type === BlockType.TEXT) {
      const block = this.block as TextBlock;
      if (block.textBlockType === TextBlockType.HEADER) {
        this.blockStyle = BlockStyle.HEADER;
      }
    }
  }

  addBlock(type: BlockTypeAndSubType) {
    this.createBlock.emit({
      id: this.blockId,
      type: type.type,
      textBlockType: type.textBlockType,
    });
  }

  deleteTransmitter(blockId: string) {
    this.deleteEvent.emit(blockId);
  }

}
