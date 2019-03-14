import { Component, OnInit } from '@angular/core';
import { QuestionType } from 'src/app/classes/question-block';

@Component({
  selector: 'app-question-block',
  templateUrl: './question-block.component.html',
  styleUrls: ['./question-block.component.scss']
})
export class QuestionBlockComponent implements OnInit {
  isPreviewMode = true;
  isQuestionOptionShown = false;
  currentType = 'short answer';
  value = {
    question: '',
    type: QuestionType.CHECKBOX,
    option: [
      ``
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
