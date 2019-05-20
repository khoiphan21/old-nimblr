import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { InputType } from 'src/API';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { InputBlockController } from '../controller/input-block-controller';
import { InputBlock } from 'src/app/classes/block/input-block';

@Component({
  selector: 'app-input-option',
  templateUrl: './input-option.component.html',
  styleUrls: ['./input-option.component.scss']
})
export class InputOptionComponent implements OnInit, OnChanges {
  private WAIT_TIME = 300; // in milliseconds

  currentBlock: InputBlock;
  currentAnswers: Array<string>;
  currentOptions: Array<string>;
  currentType: InputType;

  @Input() controller: InputBlockController;
  @Input() inputType: InputType;
  @Input() isPreviewMode = false;
  @Input() isMobilePreview = false;
  @Input() isEditable = true;

  formGroup: FormGroup; 2;

  private timeout: any;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.controller.getInputBlock$().subscribe(block => {
      if (block !== null) {
        console.log('InputBlock received: ', block);
        this.currentBlock = block;
        this.currentAnswers = block.answers.map(v => v);
        this.currentOptions = block.options.map(v => v).filter(v => v !== null);
        this.currentType = block.inputType;
        this.setupForm();
      }
    }, console.error);
  }

  ngOnChanges(change: SimpleChanges) {
    if (change.inputType && this.currentBlock) {
      this.currentType = change.inputType.currentValue;
      this.handleInputTypeChange(
        change.inputType.previousValue,
        change.inputType.currentValue
      );
      this.triggerUpdateValue();
    }
  }

  handleInputTypeChange(previousType: InputType, currentType: InputType) {
    switch (currentType) {
      case InputType.TEXT:
        this.changeToSingleOptionType(previousType);
        break;
      default:
        if (previousType !== undefined) {
          this.clearAnswers();
        }
        break;
    }
    this.setupForm();
  }

  changeToSingleOptionType(previousType: InputType) {
    if (previousType === InputType.MULTIPLE_CHOICE || previousType === InputType.CHECKBOX) {
      this.clearAnswers();
      this.currentOptions = [];
    }
  }

  private clearAnswers() {
    this.currentAnswers = [];
  }

  setupForm() {
    this.formGroup = this.formBuilder.group({
      options: this.formBuilder.array([])
    });
    this.setOptions();
    this.formGroup.valueChanges.subscribe(() => this.triggerUpdateValue());

  }

  updateCurrentOptions() {
    const formArray = this.formGroup.controls.options as FormArray;
    const controls = formArray.controls;

    const options = controls.map(v => v.value.option);
    this.currentOptions = options;
  }

  setOptions() {
    const control = this.formGroup.controls.options as FormArray;
    if (this.currentOptions.length > 0) {
      for (const option of this.currentOptions) {
        control.push(this.formBuilder.group({
          option
        }));
      }
    } else {
      this.currentOptions = [];
      this.addNewOption();
    }
  }

  addNewOption() {
    const control = this.formGroup.controls.options as FormArray;
    control.push(
      this.formBuilder.group({
        option: ''
      })
    );
    this.triggerUpdateValue();
  }

  deleteOption(index) {
    const control = this.formGroup.controls.options as FormArray;
    control.removeAt(index);
    this.triggerUpdateValue();
  }

  toggleAnswers(value: string) {
    if (this.currentAnswers.includes(value)) {
      const index = this.currentAnswers.indexOf(value);
      this.currentAnswers.splice(index, 1);
    } else {
      this.currentAnswers.push(value);
    }
    this.setupForm();
    this.triggerUpdateValue();
  }

  switchAnswer(value: string) {
    this.clearAnswers();
    this.currentAnswers.push(value);
    this.setupForm();
    this.triggerUpdateValue();
  }

  triggerUpdateValue(waitTime = this.WAIT_TIME) {
    console.log('updating value');
    this.updateCurrentOptions();

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.controller.update({
        answers: this.currentAnswers,
        options: this.currentOptions,
        inputType: this.currentType
      });
    }, waitTime);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.currentOptions, event.previousIndex, event.currentIndex);
    this.setupForm();
    this.triggerUpdateValue();
  }
}
