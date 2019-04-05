import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTextComponent } from './block-text.component';
import { FormsModule } from '@angular/forms';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';
import { BlockType } from 'src/API';
import { BlockCommandService } from 'src/app/services/block/command/block-command.service';
import { configureTestSuite } from 'ng-bullet';
import { TextBlock } from 'src/app/classes/block/textBlock';
import { SimpleChange } from '@angular/core';

const uuidv4 = require('uuid/v4');

describe('BlockTextComponent', () => {
  let component: BlockTextComponent;
  let fixture: ComponentFixture<BlockTextComponent>;
  let blockFactoryService: BlockFactoryService;
  const rawData = {
    id: uuidv4(),
    type: BlockType.TEXT,
    version: uuidv4(),
    documentId: uuidv4(),
    lastUpdatedBy: uuidv4(),
    value: 'test',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [BlockTextComponent],
      imports: [
        FormsModule
      ],
      providers: [
        BlockFactoryService,
        BlockCommandService,
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockTextComponent);
    blockFactoryService = TestBed.get(BlockFactoryService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* tslint:disable:no-string-literal */
  describe('ngOnChanges()', () => {
    let block: TextBlock;
    let changeDetectorSpy: jasmine.Spy;

    beforeEach(() => {
      block = blockFactoryService.createNewTextBlock({
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });
      fixture = TestBed.createComponent(BlockTextComponent);
      component = fixture.componentInstance;
      component.block = block;
      component.isUserLoggedIn = true;
      fixture.detectChanges();

      // Setup spies
      changeDetectorSpy = spyOn(component['changeDetector'], 'detectChanges');
      changeDetectorSpy.and.callThrough();
    });

    it('should set the block value', () => {
      rawData.value = 'test';
      block = blockFactoryService.createAppBlock(rawData) as TextBlock;
      component.block = block;
      fixture.detectChanges();
      component.ngOnChanges({
        isFocused: new SimpleChange(null, true, false)
      });
      expect(component.value).toBe('test');
    });

    describe('when isFocused is defined', () => {
      it('should call changeDetector if isFocused is true', () => {
        component.ngOnChanges({
          isFocused: new SimpleChange(null, true, false)
        });
        expect(changeDetectorSpy).toHaveBeenCalled();
      });

      it('should focus on the element if isFocused is true', () => {
        component.ngOnChanges({
          isFocused: new SimpleChange(null, true, false)
        });
        const element = document.getElementById(block.id);
        expect(document.activeElement === element).toBe(true);
      });

      it('should not do anything if isFocused is false', () => {
        component.ngOnChanges({
          isFocused: new SimpleChange(null, false, false)
        });
        expect(changeDetectorSpy).not.toHaveBeenCalled();
        const element = document.getElementById(block.id);
        expect(document.activeElement === element).toBe(false);
      });
    });

    describe('when isFocused is not defined or null', () => {
      it('should not do anything', () => {
        component.ngOnChanges({
          isFocused: undefined
        });
        expect(changeDetectorSpy).not.toHaveBeenCalled();
        let element = document.getElementById(block.id);
        expect(document.activeElement === element).toBe(false);
        component.ngOnChanges({
          isFocused: null
        });
        expect(changeDetectorSpy).not.toHaveBeenCalled();
        element = document.getElementById(block.id);
        expect(document.activeElement === element).toBe(false);
      });
    });

  });

  // TODO: Test this
  /* tslint:disable:no-string-literal */
  describe('updateValue', () => {
    let blockCommandSpy: jasmine.Spy;

    beforeEach(() => {
      // setup the spies
      spyOn(component['factoryService'], 'createAppBlock').and.callThrough();
      blockCommandSpy = spyOn(component['blockCommandService'], 'updateBlock');
      blockCommandSpy.and.returnValues(Promise.resolve());
      // create a block for the component
      const block: any = blockFactoryService.createAppBlock(rawData);
      component.block = block;
      component.value = 'test';
    });

    it('should call `createAppBlock` with the right argument', async () => {
      await component.updateValue();
      expect(component['factoryService'].createAppBlock).toHaveBeenCalledWith({
        id: component.block.id,
        type: component.block.type,
        documentId: component.block.documentId,
        lastUpdatedBy: component.block.lastUpdatedBy,
        value: component.value,
        createdAt: component.block.createdAt
      });
    });

    it('should resolve with the updated block', async () => {
      const updatedBlock: TextBlock = await component.updateValue() as TextBlock;
      expect(updatedBlock.value).toEqual(component.value);
    });

    it('should call block command service with the right argument', async () => {
      const updatedBlock = await component.updateValue();
      expect(blockCommandSpy).toHaveBeenCalledWith(updatedBlock);
    });

    it('should not call block command service again for consecutive updates', done => {
      component.updateValue();
      setTimeout(() => {
        component.updateValue().then(() => {
          expect(blockCommandSpy).toHaveBeenCalledTimes(1);
          done();
        });
      }, 100);
    });

  });

  describe('togglePlaceholder() - should toggle `isPlaceholderShown` into the right value when', () => {
    it('`value` is valid and `status` is true', () => {
      component.value = 'test';
      component.togglePlaceholder(true);
      expect(component.isPlaceholderShown).toBe(false);
    });


    it('`value` is valid and `status` is false', () => {
      component.value = 'test';
      component.togglePlaceholder(false);
      expect(component.isPlaceholderShown).toBe(false);
    });

    it('`value` is not valid and `status` is true', () => {
      component.value = '';
      component.togglePlaceholder(true);
      expect(component.isPlaceholderShown).toBe(true);
    });

  });

  describe('onBackSpaceAndEmptyTextbox()', () => {
    beforeEach(() => {
      const factory: BlockFactoryService = TestBed.get(BlockFactoryService);
      component.block = factory.createNewTextBlock({
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });
    });

    it('should emit the id if the value is empty', done => {
      component.value = '';
      component.deleteEvent.subscribe(value => {
        expect(value).toEqual(component.block.id);
        done();
      });
      component.onBackSpaceAndEmptyTextbox();
    });

    it('should not emit if the value is not empty', () => {
      component.value = 'test';
      spyOn(component.deleteEvent, 'emit');
      component.onBackSpaceAndEmptyTextbox();
      expect(component.deleteEvent.emit).not.toHaveBeenCalled();
    });

  });

});
