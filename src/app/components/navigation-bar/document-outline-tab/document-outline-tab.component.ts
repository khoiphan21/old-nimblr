import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UUID } from '../../../services/document/command/document-command.service';
import { BlockQueryService } from '../../../services/block/query/block-query.service';
import { TextBlock } from '../../../classes/block/textBlock';
import { Subscription } from 'rxjs';
import { TextBlockType } from 'src/API';

@Component({
  selector: 'app-document-outline-tab',
  templateUrl: './document-outline-tab.component.html',
  styleUrls: ['./document-outline-tab.component.scss']
})
export class DocumentOutlineTabComponent implements OnInit {
  @Input() id: UUID;
  @Output() tabDestroyEvent = new EventEmitter<boolean>();
  title: string;
  previousType: TextBlockType;
  isHeader: boolean;
  subscription: Subscription;
  constructor(
    private blockQueryService: BlockQueryService
  ) { }

  // TODO: @jeremy cover error test
  ngOnInit() {
    this.subscription = this.blockQueryService.getBlock$(this.id).subscribe((block) => {
      if (block !== null) {
        const textBlock = block as TextBlock;
        this.isHeader = textBlock.textBlockType === TextBlockType.HEADER;
        this.title = textBlock.value;
      }
    }, error => {
      const newError = new Error(`documentOutlineTab failed to get block: ${error.message}`);
      console.error(newError, this.id);
    });
  }

  scrollToSection(uuid: UUID) {
    const element = document.getElementById(uuid);
    element.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
  }
}
