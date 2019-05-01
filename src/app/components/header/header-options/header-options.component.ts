import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { slideBottomToTopAnimation, fadeInOutAnimation } from 'src/app/animation';

@Component({
  selector: 'app-header-options',
  templateUrl: './header-options.component.html',
  styleUrls: ['./header-options.component.scss'],
  animations: [slideBottomToTopAnimation, fadeInOutAnimation]
})
export class HeaderOptionsComponent implements OnInit {
  @Input() isOptionShown: boolean;
  @Input() documentType: DocumentType;

  @Output() hideOptionEvent = new EventEmitter<boolean>();
  @Output() deleteDocumentEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  hideOption() {
    this.hideOptionEvent.emit(false);
  }

  deleteDocument() {
    this.hideOptionEvent.emit(false);
    this.deleteDocumentEvent.emit();
  }
}
