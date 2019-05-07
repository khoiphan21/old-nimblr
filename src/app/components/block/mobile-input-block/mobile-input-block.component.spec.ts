import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileInputBlockComponent } from './mobile-input-block.component';
import { InputOptionComponent } from '../input-block/input-option/input-option.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { InputType, BlockType } from 'src/API';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';
import { InputBlock } from 'src/app/classes/block/input-block';
import { RouterTestingModule } from '@angular/router/testing';
const uuidv4 = require('uuid/v4');
describe('MobileInputBlockComponent', () => {
  let component: MobileInputBlockComponent;
  let fixture: ComponentFixture<MobileInputBlockComponent>;
  let blockFactoryService: BlockFactoryService;
  const rawData = {
    id: uuidv4(),
    type: BlockType.INPUT,
    version: uuidv4(),
    documentId: uuidv4(),
    lastUpdatedBy: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    answers: [''],
    inputType: InputType.TEXT,
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        MobileInputBlockComponent,
        InputOptionComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([])
      ]
    });
  });

  beforeEach(() => {
    blockFactoryService = TestBed.get(BlockFactoryService);
    const block = blockFactoryService.createAppBlock(rawData);
    fixture = TestBed.createComponent(MobileInputBlockComponent);
    component = fixture.componentInstance;
    spyOn(component, 'toggleOptions').and.callThrough();
    component.inputBlock = block as InputBlock;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectType()', () => {
    it('should change the `currentType` to the right value', () => {
      component.selectType(InputType.MULTIPLE_CHOICE);
      expect(component.currentType).toBe(InputType.MULTIPLE_CHOICE);
    });

    it('should toggle the option', () => {
      component.selectType(InputType.MULTIPLE_CHOICE);
      expect(component.toggleOptions).toHaveBeenCalled();
    });
  });

  /* tslint:disable:no-string-literal */
  describe('updateInputValueMobile', () => {
    let parentMethodSpy: jasmine.Spy;
    const emittedValue = {
      answers: [],
    };
    beforeEach(() => {
      parentMethodSpy = spyOn(component, 'updateInputValue');
      parentMethodSpy.and.returnValue(Promise.resolve());
    });

    it('should update the preview answers and options', async () => {
      await component.updateInputValueMobile(emittedValue);
      expect(component.previewAnswers).toEqual(emittedValue.answers);
      expect(component.previewOptions).toBe(undefined);
    });

    it('should call the parent method with the right argument', async () => {
      await component.updateInputValueMobile(emittedValue);
      expect(parentMethodSpy).toHaveBeenCalledWith(emittedValue);
    });
  });

});
