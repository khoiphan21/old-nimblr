import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTextComponent } from './block-text.component';
import { FormsModule } from '@angular/forms';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';
import { BlockType, TextBlockType } from 'src/API';
import { BlockCommandService } from 'src/app/services/block/command/block-command.service';
import { configureTestSuite } from 'ng-bullet';
import { TextBlock } from 'src/app/classes/block/textBlock';
import { SimpleChange } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

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
        FormsModule,
        RouterTestingModule.withRoutes([])
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
    component.block = blockFactoryService.createNewTextBlock({
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4()
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* tslint:disable:no-string-literal */
  describe('ngOnChanges()', () => {
    let block: TextBlock;

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
    });

    it('should set the block value', () => {
      component.ngOnChanges({
        block: new SimpleChange(null, { value: '1234' }, false)
      });
      expect(component.value).toBe('1234');
    });

    describe('when focusBlockId is defined -', () => {
      let textBlock;
      const input = {
        type: BlockType.TEXT,
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4(),
        value: 'test'
      };
      beforeEach(() => {
        textBlock = blockFactoryService.createAppBlock(input);
      });

      it('should focus on the element', async () => {
        await component.ngOnChanges({
          focusBlockId: new SimpleChange(null, block.id + '1234', false)
        });
        const element = document.getElementById(block.id);
        expect(document.activeElement === element).toBe(true);
      });

      it('should call setCaretToEnd()', () => {
        spyOn(component, 'setCaretToEnd');
        component.ngOnChanges({
          focusBlockId: new SimpleChange(null, block.id + '1234', false)
        });
        expect(component.setCaretToEnd).toHaveBeenCalled();
      });
    });

    describe('when focusBlockId is not the right value', () => {
      beforeEach(() => {
        spyOn(component, 'setCaretToEnd');
      });

      it('should not do anything if focusBlockId does not have the block id', () => {
        component.ngOnChanges({
          focusBlockId: new SimpleChange(null, '1234', false)
        });
        const element = document.getElementById(block.id);
        expect(document.activeElement === element).toBe(false);
        expect(component.setCaretToEnd).not.toHaveBeenCalled();
      });

      it('should not do anything if focusBlockId is undefined or null', () => {
        // null
        component.ngOnChanges({
          focusBlockId: new SimpleChange(null, null, false)
        });
        let element = document.getElementById(block.id);
        expect(document.activeElement === element).toBe(false);
        expect(component.setCaretToEnd).not.toHaveBeenCalled();
        // undefined
        component.ngOnChanges({
          focusBlockId: new SimpleChange(null, undefined, false)
        });
        element = document.getElementById(block.id);
        expect(document.activeElement === element).toBe(false);
        expect(component.setCaretToEnd).not.toHaveBeenCalled();
      });
    });

    describe('when isFocused is not defined or null', () => {
      it('should not do anything', () => {
        component.ngOnChanges({
          isFocused: undefined
        });
        let element = document.getElementById(block.id);
        expect(document.activeElement === element).toBe(false);
        component.ngOnChanges({
          isFocused: null
        });
        element = document.getElementById(block.id);
        expect(document.activeElement === element).toBe(false);
      });
    });

  });

  describe('setCaretToEnd()', () => {
    let div: HTMLElement;
    beforeEach(() => {
      div = document.createElement('div');
      div.setAttribute('id', component.block.id);
      div.setAttribute('contenteditable', '');
      document.body.appendChild(div);
    });
    it('should set caret to the beginning if value is empty', async () => {
      component.value = '';
      await component.setCaretToEnd();
      expect(window.getSelection().focusOffset).toBe(0);
    });
    it('should set caret to the end of the value', async () => {
      component.value = 'test';
      div.textContent = component.value;
      await component.setCaretToEnd();
      expect(window.getSelection().focusOffset).toBe(1);
    });
    it('should fail if the element does not exist', async () => {
      div.remove();
      try {
        await component.setCaretToEnd();
        fail('error should occur');
      } catch (error) {
        const message = 'Failed to set caret: element does not exist';
        expect(error.message).toEqual(message);
      }
    });
  });

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

  describe('togglePlaceholder()', () => {
    it('should set the isPlaceholderShown value', () => {
      component.togglePlaceholder(false);
      expect(component.isPlaceholderShown).toBe(false);
      component.togglePlaceholder(true);
      expect(component.isPlaceholderShown).toBe(true);
    });
  });

  describe('onBackSpaceAndEmptyTextbox()', () => {
    const event = new KeyboardEvent('keydown', { key: 'Backspace' });

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
      component.onBackSpaceAndEmptyTextbox(event);
    });

    it('should not emit if the value is not empty', () => {
      component.value = 'test';
      spyOn(component.deleteEvent, 'emit');
      component.onBackSpaceAndEmptyTextbox(event);
      expect(component.deleteEvent.emit).not.toHaveBeenCalled();
    });
  });

  it('createTextBlockOnEnter() - should emit the correct blockType', done => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.createBlock.subscribe(type => {
      expect(type).toEqual(BlockType.TEXT);
      done();
    });
    component.createTextBlockOnEnter(event);
  });

  describe('onPaste()', () => {
    let pasteEvent: any;
    let setCaretSpy;
    let updateValueSpy;
    const value = 'test';
    beforeEach(() => {
      setCaretSpy = spyOn(component, 'setCaretToEnd');
      updateValueSpy = spyOn(component, 'updateValue');
      pasteEvent = {
        preventDefault: () => {},
        clipboardData: {
          getData: () => value
        }
      };
    });

    it('should call updateValue()', () => {
      component.onPaste(pasteEvent);
      expect(updateValueSpy).toHaveBeenCalled();
    });

    it('should call setCaretToEnd()', () => {
      component.onPaste(pasteEvent);
      expect(setCaretSpy).toHaveBeenCalled();
    });

    it('should update the value to the lastest', () => {
      const currentValue = 'data';
      component.value = currentValue;
      component.onPaste(pasteEvent);
      expect(component.value).toEqual(currentValue + value);
    });
  });
});
