import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBlockComponent } from './input-block.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { InputType, BlockType } from 'src/API';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';
import { InputBlock } from 'src/app/classes/block/input-block';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
const uuidv4 = require('uuid/v4');

describe('InputBlockComponent', () => {
  let component: InputBlockComponent;
  let fixture: ComponentFixture<InputBlockComponent>;
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
    isLocked: false
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        InputBlockComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  beforeEach(() => {
    blockFactoryService = TestBed.get(BlockFactoryService);
    const block = blockFactoryService.createAppBlock(rawData);
    fixture = TestBed.createComponent(InputBlockComponent);
    component = fixture.componentInstance;
    spyOn(component, 'toggleOptions').and.callThrough();
    component.inputBlock = block as InputBlock;
    component.ngOnChanges({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* tslint:disable:no-string-literal */
  describe('ngOnChanges()', () => {
    let block: InputBlock;
    let changeDetectorSpy: jasmine.Spy;

    beforeEach(() => {
      block = blockFactoryService.createNewInputBlock({
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });
      fixture = TestBed.createComponent(InputBlockComponent);
      component = fixture.componentInstance;
      component.inputBlock = block;
      fixture.detectChanges();

      // Setup spies
      changeDetectorSpy = spyOn(component['changeDetector'], 'detectChanges');
      changeDetectorSpy.and.callThrough();
    });

    describe('when focusBlockId is defined', () => {

      it('should not do anything if focusBlockId does not have the block id', () => {
        component.ngOnChanges({
          focusBlockId: new SimpleChange(null, 'asdf', false)
        });
        expect(changeDetectorSpy).not.toHaveBeenCalled();
        const element = document.getElementById(block.id + '-input');
        expect(document.activeElement === element).toBe(false);
      });

      it('should not do anything if focusBlockId has null value', () => {
        component.ngOnChanges({
          focusBlockId: new SimpleChange(null, null, false)
        });
        expect(changeDetectorSpy).not.toHaveBeenCalled();
        const element = document.getElementById(block.id + '-input');
        expect(document.activeElement === element).toBe(false);
      });

      it('should not do anything if focusBlockId has undefined value', () => {
        component.ngOnChanges({
          focusBlockId: new SimpleChange(null, undefined, false)
        });
        expect(changeDetectorSpy).not.toHaveBeenCalled();
        const element = document.getElementById(block.id + '-input');
        expect(document.activeElement === element).toBe(false);
      });
    });

    describe('when focusBlockId is not defined or null', () => {
      it('should not do anything', () => {
        // undefined case
        component.ngOnChanges({
          focusBlockId: undefined
        });
        expect(changeDetectorSpy).not.toHaveBeenCalled();
        let element = document.getElementById(block.id + '-input');
        expect(document.activeElement === element).toBe(false);
        // null case
        component.ngOnChanges({
          focusBlockId: null
        });
        expect(changeDetectorSpy).not.toHaveBeenCalled();
        element = document.getElementById(block.id + '-input');
        expect(document.activeElement === element).toBe(false);
      });
    });

    describe('when inputBlock is defined', () => {
      it('should call setInputValues()', () => {
        spyOn<any>(component, 'setInputValues');
        // undefined case
        component.ngOnChanges({
          inputBlock: new SimpleChange(null, block, true)
        });
        expect(component['setInputValues']).toHaveBeenCalled();
      });
    });
  });

  describe('toggleOptions()', () => {
    it('should toggle isInputOptionShown() from false to true', () => {
      component.toggleOptions();
      expect(component.isInputOptionShown).toBe(true);
    });

    it('should toggle isInputOptionShown() from true to false', () => {
      component.isInputOptionShown = true;
      component.toggleOptions();
      expect(component.isInputOptionShown).toBe(false);
    });
  });

  describe('selectType()', () => {
    const event = new Event('click');
    it('should change the `currentType` to the right value', () => {
      component.selectType(InputType.MULTIPLE_CHOICE, event);
      expect(component.currentType).toBe('MULTIPLE_CHOICE');
    });

    it('should toggle the option', () => {
      component.selectType(InputType.MULTIPLE_CHOICE, event);
      expect(component.toggleOptions).toHaveBeenCalled();
    });
  });

  /* tslint:disable:no-string-literal */
  describe('updateInputValue', () => {
    let blockCommandSpy: jasmine.Spy;
    const emittedValue = {
      answers: [],
    };
    beforeEach(() => {
      // setup the spies
      spyOn(component['blockFactoryService'], 'createAppBlock').and.callThrough();
      blockCommandSpy = spyOn(component['blockCommandService'], 'updateBlock');
      blockCommandSpy.and.returnValues(Promise.resolve());
      component.currentType = InputType.TEXT;
    });

    it('should call `createAppBlock` with the right argument', async () => {
      await component.updateInputValue(emittedValue);
      expect(component['blockFactoryService'].createAppBlock).toHaveBeenCalledWith({
        id: component.inputBlock.id,
        type: component.inputBlock.type,
        documentId: component.inputBlock.documentId,
        createdAt: component.inputBlock.createdAt,
        lastUpdatedBy: component.inputBlock.lastUpdatedBy,
        answers: [],
        inputType: component.inputBlock.inputType,
        options: undefined,
        isLocked: component.isLocked
      });
    });

    it('should call block command service with the right argument', async () => {
      const updatedBlock = await component.updateInputValue(emittedValue);
      expect(blockCommandSpy).toHaveBeenCalledWith(updatedBlock);
    });
  });

});
