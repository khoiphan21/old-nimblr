import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { slideBottomToTopAnimation } from 'src/app/animation';

@Component({
  selector: 'app-header-options',
  templateUrl: './header-options.component.html',
  styleUrls: ['./header-options.component.scss'],
  animations: [slideBottomToTopAnimation]
})
export class HeaderOptionsComponent implements OnInit {
  @Input() isOptionShown: boolean;
  @Output() hideOptionEvent = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  hideOption() {
    this.hideOptionEvent.emit(false);
  }

}
