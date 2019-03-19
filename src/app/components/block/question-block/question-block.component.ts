import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-block',
  templateUrl: './question-block.component.html',
  styleUrls: ['./question-block.component.scss']
})
export class QuestionBlockComponent implements OnInit {
  isPreviewMode = true;
  isQuestionOptionShown = false;
  question = '';
  currentType = 'short answer';
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

  selectType(type: string, event: Event) {
    this.currentType = type;
    this.toggleOptions();
    this.isPreviewMode = false;
    event.stopImmediatePropagation();
  }
}
