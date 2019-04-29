import { Component, OnInit, Input } from '@angular/core';
import { UUID } from '../../../services/document/command/document-command.service';
import { BlockQueryService } from '../../../services/block/query/block-query.service';
import { TextBlock } from '../../../classes/block/textBlock';

@Component({
  selector: 'app-document-outline-tab',
  templateUrl: './document-outline-tab.component.html',
  styleUrls: ['./document-outline-tab.component.scss']
})
export class DocumentOutlineTabComponent implements OnInit {
  @Input() id: UUID;
  title: string;
  constructor(
    private blockQueryService: BlockQueryService
  ) { }

  // TODO: @jeremy cover error test
  ngOnInit() {
    this.blockQueryService.getBlock$(this.id).subscribe((block) => {
      if (block !== null) {
        const textBlock = block as TextBlock;
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
