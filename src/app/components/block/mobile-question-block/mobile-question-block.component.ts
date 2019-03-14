import { Component, OnInit } from '@angular/core';
import { slideBottomToTopAnimation } from 'src/app/animation';

@Component({
  selector: 'app-mobile-question-block',
  templateUrl: './mobile-question-block.component.html',
  styleUrls: ['./mobile-question-block.component.scss'],
  animations: [slideBottomToTopAnimation]
})
export class MobileQuestionBlockComponent implements OnInit {
  isPreviewMode = true;
  isQuestionOptionShown = false;
  question = 'Untitled Question';
  currentType = 'checkbox';
  data = {
    options: [
      {
        checked: false,
        answer: ''
      }
    ]
  };
  constructor() { }

  ngOnInit() {
  }

  toggleOptions() {
    this.isQuestionOptionShown = this.isQuestionOptionShown ? false : true;
  }

  selectType(type: string) {
    this.currentType = type;
    this.toggleOptions();
  }

}
