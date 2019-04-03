import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTextComponent } from './block-text.component';
import { FormsModule } from '@angular/forms';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';
import { BlockType } from 'src/API';
import { BlockCommandService } from 'src/app/services/block/command/block-command.service';
import { configureTestSuite } from 'ng-bullet';
import { TextBlock } from "src/app/classes/block/textBlock";
import { Block } from 'src/app/classes/block/block';

const uuidv4 = require('uuid/v4');

describe('BlockTextComponent', () => {
  let component: BlockTextComponent;
  let fixture: ComponentFixture<BlockTextComponent>;
  let blockFactroyService: BlockFactoryService;
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
    blockFactroyService = TestBed.get(BlockFactoryService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* tslint:disable:no-string-literal */
  describe('ngOnInit()', () => {
    let block: TextBlock;

    beforeEach(() => {
      block = blockFactroyService.createNewTextBlock({
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });
      fixture = TestBed.createComponent(BlockTextComponent);
      component = fixture.componentInstance;
      component.block = block;
      component.isUserLoggedIn = true;
      fixture.detectChanges();
    });

    describe('if isFocused', () => {
      it('should call changeDetector to detect changes', () => {
        const changeDetectorSpy = spyOn(component['changeDetector'], 'detectChanges');
        changeDetectorSpy.and.callThrough();

        component.isFocused = true;
        component.ngOnInit();

        expect(changeDetectorSpy).toHaveBeenCalled();
      });
      it('should focus on the right element', () => {
        component.isFocused = true;
        component.ngOnInit();
        const element = document.getElementById(block.id);

        expect(document.activeElement === element).toBe(true);
      });
    });

    describe('if not isFocused', () => {
      it('should not call changeDetector', () => {
        spyOn(component['changeDetector'], 'detectChanges');
        component.isFocused = false;
        component.ngOnInit();
        expect(component['changeDetector'].detectChanges).not.toHaveBeenCalled();
      });
      it('should not call getElementById', () => {
        spyOn(document, 'getElementById');
        component.isFocused = false;
        component.ngOnInit();
        expect(document.getElementById).not.toHaveBeenCalled();
      });
    });
  });

  describe('ngOnChanges() - should set `value` into the right value when', () => {
    it('`block.value` is not empty', () => {
      rawData.value = null;
      const block: any = blockFactroyService.createAppBlock(rawData);
      component.block = block;
      component.ngOnChanges();
      expect(component.value).toBe('');
    });

    it('`block.value` is empty', () => {
      rawData.value = 'test';
      const block: any = blockFactroyService.createAppBlock(rawData);
      component.block = block;
      component.ngOnChanges();
      expect(component.value).toBe('test');
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
      const block: any = blockFactroyService.createAppBlock(rawData);
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
});
