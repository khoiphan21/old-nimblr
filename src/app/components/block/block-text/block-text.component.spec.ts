import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTextComponent } from './block-text.component';
import { FormsModule } from '@angular/forms';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';
import { BlockType } from 'src/API';
import { BlockCommandService } from 'src/app/services/block/command/block-command.service';
import { configureTestSuite } from 'ng-bullet';
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
      declarations: [ BlockTextComponent ],
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
  xdescribe('updateValue', () => {
    beforeEach(() => {
      spyOn(component['factoryService'], 'createAppBlock').and.callThrough();
      spyOn(component['blockCommandService'], 'updateBlock');
      const block: any = blockFactroyService.createAppBlock(rawData);
      component.block =  block;
      fixture.detectChanges();
      component.updateValue();
    });

    it('should call `createAppBlock`', done => {
      component.value = 'test';
      setTimeout(() => {
        expect(component['factoryService'].createAppBlock).toHaveBeenCalled();
        done();
      }, 500);
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
