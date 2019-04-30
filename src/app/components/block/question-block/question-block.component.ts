import { Component, Input, OnChanges, ChangeDetectorRef, SimpleChanges, OnInit } from '@angular/core';
import { QuestionBlock } from 'src/app/classes/block/question-block';
import { QuestionType } from 'src/API';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';
import { BlockCommandService } from 'src/app/services/block/command/block-command.service';
import { Block } from 'src/app/classes/block/block';

@Component({
  selector: 'app-question-block',
  templateUrl: './question-block.component.html',
  styleUrls: ['./question-block.component.scss']
})
export class QuestionBlockComponent implements OnInit, OnChanges {
  // TODO IMPLEMENT CONTROL OF WHETHER IT'S DEITABLE OR NOT
  // To control whether it's editable or not
  @Input() isUserLoggedIn: boolean;
  @Input() questionBlock: QuestionBlock;
  @Input() focusBlockId: string;

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
    private blockCommandService: BlockCommandService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.setQuestionValues();
  }

  private setQuestionValues() {
    this.answers = this.questionBlock.answers;
    this.options = this.questionBlock.options;
    this.question = this.questionBlock.question;
    this.currentType = this.questionBlock.questionType;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.focusBlockId) {
      const focus = changes.focusBlockId;
      if (!focus.currentValue) { return; }
      if (focus.currentValue.includes(this.questionBlock.id)) {
        this.changeDetector.detectChanges();
        document.getElementById(this.questionBlock.id + '-question').focus();
        setTimeout(() => {
          // NOTE: still don't know why wrapping in timeout works.
          // TODO: IMPROVE THIS
          this.isPreviewMode = false;
        }, 5);
      }
    } else if (changes.questionBlock) {
      this.setQuestionValues();
    }
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
