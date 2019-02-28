import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockComponent } from './block.component';
import { BlockOptionComponent } from './block-option/block-option.component';
import { BlockTextComponent } from './block-text/block-text.component';
import { BlockHeaderComponent } from './block-header/block-header.component';
import { QuestionBlockComponent } from './question-block/question-block.component';
import { CheckboxComponent } from './question-block/checkbox/checkbox.component';
import { DropdownComponent } from './question-block/dropdown/dropdown.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MultipleChoiceComponent } from './question-block/multiple-choice/multiple-choice.component';

describe('BlockComponent', () => {
  let component: BlockComponent;
  let fixture: ComponentFixture<BlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BlockComponent,
        BlockOptionComponent,
        BlockTextComponent,
        BlockHeaderComponent,
        QuestionBlockComponent,
        CheckboxComponent,
        DropdownComponent,
        MultipleChoiceComponent
      ],
      imports: [
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
