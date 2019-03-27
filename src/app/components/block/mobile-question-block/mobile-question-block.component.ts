import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { slideBottomToTopAnimationDOM } from 'src/app/animation';
import { QuestionBlock } from 'src/app/classes/question-block';
import { QuestionType } from 'src/API';
import { Block } from 'src/app/classes/block';
import { BlockCommandService } from 'src/app/services/block/command/block-command.service';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';

@Component({
  selector: 'app-mobile-question-block',
  templateUrl: './mobile-question-block.component.html',
  styleUrls: ['./mobile-question-block.component.scss'],
  animations: [slideBottomToTopAnimationDOM]
})
export class MobileQuestionBlockComponent implements OnChanges {
  @Input() questionBlock: QuestionBlock;
  isPreviewMode = true;
  isQuestionOptionShown = false;
  previewAnswers = [];
  previewOptions = [];
  answers = [];
  options = [];
  question = '';
  currentType: QuestionType;
  constructor(
    private blockFactoryService: BlockFactoryService,
    private blockCommandService: BlockCommandService
  ) { }

  ngOnChanges() {
    this.answers = this.questionBlock.answers;
    this.options = this.questionBlock.options;
    this.previewAnswers = this.questionBlock.answers;
    this.previewOptions = this.questionBlock.options;
    this.question = this.questionBlock.question;
    this.currentType = this.questionBlock.questionType;
  }

  toggleOptions() {
    this.isQuestionOptionShown = this.isQuestionOptionShown ? false : true;
  }

  selectType(type: QuestionType) {
    this.currentType = type;
    this.toggleOptions();
  }

  updateQuestionValue(event: any): Promise<Block> {
    this.previewAnswers = event.answers;
    this.previewOptions = event.options;
    return new Promise(resolve => {
      const updatedBlock: Block = this.blockFactoryService.createAppBlock({
        id: this.questionBlock.id,
        type: this.questionBlock.type,
        documentId: this.questionBlock.documentId,
        lastUpdatedBy: this.questionBlock.lastUpdatedBy,
        // createdAt: this.block.createdAt
        question: this.question,
        answers: event.answers,
        questionType: this.currentType,
        options: event.options
      });
      this.blockCommandService.updateBlock(updatedBlock).then(() => {
        resolve(updatedBlock);
      });
    });
  }
}
