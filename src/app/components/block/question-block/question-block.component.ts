import { Component, OnInit, Input } from '@angular/core';
import { QuestionBlock } from 'src/app/classes/question-block';
import { QuestionType } from 'src/API';

@Component({
  selector: 'app-question-block',
  templateUrl: './question-block.component.html',
  styleUrls: ['./question-block.component.scss']
})
export class QuestionBlockComponent implements OnInit {
  @Input() questionBlock: QuestionBlock;
  isPreviewMode = true;
  isQuestionOptionShown = false;
  question = '';
  currentType = QuestionType.SHORT_ANSWER;
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

  selectType(type: QuestionType, event: Event) {
    this.currentType = type;
    this.toggleOptions();
    this.isPreviewMode = false;
    event.stopImmediatePropagation();
  }
}
