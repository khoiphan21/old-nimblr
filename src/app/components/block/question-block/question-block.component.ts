import { Component, Input, OnInit } from '@angular/core';
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
  currentType: QuestionType;

  constructor() { }

  ngOnInit() {
    this.question = this.questionBlock.question;
    this.currentType = this.questionBlock.questionType;
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
