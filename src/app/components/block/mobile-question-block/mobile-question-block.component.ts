import { Component, OnChanges } from '@angular/core';
import { slideBottomToTopAnimationDOM } from 'src/app/animation';
import { QuestionType } from 'src/API';
import { QuestionBlockComponent } from '../question-block/question-block.component';

@Component({
  selector: 'app-mobile-question-block',
  templateUrl: './mobile-question-block.component.html',
  styleUrls: ['./mobile-question-block.component.scss'],
  animations: [slideBottomToTopAnimationDOM]
})
export class MobileQuestionBlockComponent extends QuestionBlockComponent implements OnChanges {
  previewAnswers = [];
  previewOptions = [];
  valueUpdated = true;

  ngOnChanges() {
    this.answers = this.questionBlock.answers;
    this.options = this.questionBlock.options;
    this.previewAnswers = this.questionBlock.answers;
    this.previewOptions = this.questionBlock.options;
    this.question = this.questionBlock.question;
    this.currentType = this.questionBlock.questionType;
  }

  selectType(type: QuestionType) {
    this.currentType = type;
    this.toggleOptions();
  }

  async updateQuestionValueMobile(event: any) {
    this.previewAnswers = event.answers;
    this.previewOptions = event.options;
    await this.updateQuestionValue(event);
  }

}
