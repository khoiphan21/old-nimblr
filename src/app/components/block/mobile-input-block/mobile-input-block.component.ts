import { Component, OnChanges } from '@angular/core';
import { slideBottomToTopAnimationDOM } from 'src/app/animation';
import { InputType } from 'src/API';
import { InputBlockComponent } from '../input-block/input-block.component';

@Component({
  selector: 'app-mobile-input-block',
  templateUrl: './mobile-input-block.component.html',
  styleUrls: ['./mobile-input-block.component.scss'],
  animations: [slideBottomToTopAnimationDOM]
})
export class MobileInputBlockComponent extends InputBlockComponent implements OnChanges {
  previewAnswers = [];
  previewOptions = [];
  valueUpdated = true;

  ngOnChanges() {
    this.answers = this.inputBlock.answers;
    this.options = this.inputBlock.options;
    this.previewAnswers = this.inputBlock.answers;
    this.previewOptions = this.inputBlock.options;
    this.currentType = this.inputBlock.inputType;
    this.isInputLocked = this.inputBlock.isLocked;
  }

  selectType(type: InputType) {
    this.currentType = type;
    this.toggleOptions();
  }

  async updateInputValueMobile(event: any) {
    this.previewAnswers = event.answers;
    this.previewOptions = event.options;
    await this.updateInputValue(event);
  }

}
