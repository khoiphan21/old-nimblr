import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { slideBottomToTopAnimationDOM } from 'src/app/animation';
import { InputType } from 'src/API';
import { InputBlockComponent } from '../input-block/input-block.component';
import { InputBlock } from '../../../classes/block/input-block';

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.inputBlock) {
      const block = changes.inputBlock.currentValue as InputBlock;

      this.controller.setInputBlock(block);
      this.isLocked = block.isLocked;
      this.currentType = block.inputType;
      this.previewAnswers = this.inputBlock.answers;
      this.previewOptions = this.inputBlock.options;
    }
  }

  selectType(type: InputType) {
    this.currentType = type;
    this.toggleOptions();
  }

}
