import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { QuestionBlock } from 'src/app/classes/question-block';
import { QuestionType } from 'src/API';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';
import { BlockCommandService } from 'src/app/services/block/command/block-command.service';
import { Block } from 'src/app/classes/block';

@Component({
  selector: 'app-question-block',
  templateUrl: './question-block.component.html',
  styleUrls: ['./question-block.component.scss']
})
export class QuestionBlockComponent implements OnChanges {
  @Input() questionBlock: QuestionBlock;
  valueUpdated = true;
  isPreviewMode = true;
  isQuestionOptionShown = false;
  answers = [];
  options = [];
  question = '';
  currentType: QuestionType;
  protected timeout: any;

  constructor(
    private blockFactoryService: BlockFactoryService,
    private blockCommandService: BlockCommandService
  ) { }

  ngOnChanges() {
    this.answers = this.questionBlock.answers;
    this.options = this.questionBlock.options;
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

  async triggerUpdateValue() {
    return new Promise((resolve) => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.valueUpdated = false;
        resolve();
      }, 500);
    });
  }

  updateQuestionValue(event: any): Promise<Block> {
    return new Promise(resolve => {
      const updatedBlock: Block = this.blockFactoryService.createAppBlock({
        id: this.questionBlock.id,
        type: this.questionBlock.type,
        documentId: this.questionBlock.documentId,
        lastUpdatedBy: this.questionBlock.lastUpdatedBy,
        createdAt: this.questionBlock.createdAt,
        question: this.question,
        answers: event.answers,
        questionType: this.currentType,
        options: event.options
      });
      this.blockCommandService.updateBlock(updatedBlock).then(() => {
        this.valueUpdated = true;
        resolve(updatedBlock);
      });
    });
  }
}
