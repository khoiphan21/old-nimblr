import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Block, BlockId } from '../../classes/block/block';
import { BlockQueryService } from '../../services/block/query/block-query.service';
import { BlockType } from 'src/API';
import { UUID } from 'src/app/services/document/command/document-command.service';
import { VersionService } from 'src/app/services/version/version.service';
import { CreateBlockEvent } from './createBlockEvent';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
  block: Block;
  myVersions: Set<UUID> = new Set();
  @Input() blockId: string;
  @Input() isChildDoc: boolean;
  @Input() isUserLoggedIn: boolean;
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
          this.block = block;
        }
      }
    }, error => {
      const newError = new Error(`BlockComponent failed to get block: ${error.message}`);
      // TODO: Handle error in UI
      console.error(newError, this.blockId);
    });
  }

  addBlock(type: BlockType) {
    this.createBlock.emit({
      id: this.blockId,
      type
    });
  }

  deleteTransmitter(blockId: string) {
    this.deleteEvent.emit(blockId);
  }

}
