import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-block',
  templateUrl: './question-block.component.html',
  styleUrls: ['./question-block.component.scss']
})
export class QuestionBlockComponent implements OnInit {
  isPreviewMode = true;
  isQuestionOptionShown = false;
  currentType = 'checkbox';
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
