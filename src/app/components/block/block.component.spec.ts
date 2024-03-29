import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockComponent, BlockStyle } from './block.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';
import { BlockType, TextBlockType } from 'src/API';
import { Block } from 'src/app/classes/block/block';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateBlockEvent, BlockTypeAndSubType } from './createBlockEvent';
import { configureTestSuite } from 'ng-bullet';
import { ResponsiveModule } from 'ngx-responsive';
import { take } from 'rxjs/operators';

const uuidv4 = require('uuid/v4');

describe('BlockComponent', () => {
  let component: BlockComponent;
  let fixture: ComponentFixture<BlockComponent>;
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
    textBlockType: TextBlockType.TEXT
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        BlockComponent,
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([]),
        ResponsiveModule.forRoot()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockComponent);
    blockFactoryService = TestBed.get(BlockFactoryService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* tslint:disable:no-string-literal */
  describe('ngOnInit()', () => {
    let block: Block;
    let getBlockSpy: jasmine.Spy;
    let subject: Subject<any>;

    beforeEach(() => {
      block = blockFactoryService.createAppBlock(rawData);
      // setup the spy
      subject = new Subject();
      getBlockSpy = spyOn(component['blockQueryService'], 'getBlock$');
      getBlockSpy.and.returnValue(subject);
    });

    it('should set the block into the given value if it is not empty', () => {
      component.ngOnInit();
      subject.next(block);
      expect(component.block).toEqual(block);
    });

    it('should not set the block if the version is stored and the block already exists', () => {
      component.ngOnInit();
      const originalBlock = blockFactoryService.createNewTextBlock({
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });
      component.block = originalBlock;
      component['versionService'].registerVersion(block.version);
      // now reset the stored block
      subject.next(block);
      expect(component.block.version).toBe(originalBlock.version);
    });

    it('for now, should log the error out to console', () => {
      // Spy on the console
      const consoleSpy = spyOn(console, 'error');
      // setup the values for testing
      const mockError = new Error('test');
      const message = `BlockComponent failed to get block: ${mockError.message}`;
      // first call OnInit() method to setup subscription
      component.ngOnInit();
      // then emit the error
      subject.error(mockError);
      // and check if console is called with the right message
      expect(consoleSpy.calls.mostRecent().args[0].message).toEqual(message);
    });

  });

  describe('addBlock()', () => {

    let mockBlockInfo: BlockTypeAndSubType;

    beforeEach(() => {
      mockBlockInfo = {
        type: BlockType.TEXT,
      };
    });

    it('should emit the right type', done => {
      const type = BlockType.INPUT;
      mockBlockInfo.type = BlockType.INPUT;
      component.createBlock.pipe(take(1)).subscribe((value: CreateBlockEvent) => {
        expect(value.type).toEqual(type);
        done();
      });
      component.addBlock(mockBlockInfo);
    });
    it('should emit the right id', done => {
      component.blockId = uuidv4();
      component.createBlock.pipe(take(1)).subscribe((value: CreateBlockEvent) => {
        expect(value.id).toEqual(component.blockId);
        done();
      });
      component.addBlock(mockBlockInfo);
    });
  });

  describe('deleteTransmitter()', () => {
    const id = 'test';

    it('should emit the given blockId', done => {
      component.deleteEvent.pipe(take(1)).subscribe(value => {
        expect(value).toEqual(id);
        done();
      });
      component.deleteTransmitter(id);
    });
  });

  describe('styleBlock()', () => {
    let mockBlock: any;

    beforeEach(() => {
      mockBlock = {
        type: BlockType.TEXT,
        textBlockType: TextBlockType.TEXT
      };
    });

    it('should not set the style if it is TEXT type', () => {
      component.block = mockBlock;
      component.blockStyle = undefined;
      component['styleBlock']();
      expect(component.blockStyle).toEqual(undefined);
    });

    it('should set the style if it is HEADER type', () => {
      mockBlock.textBlockType = TextBlockType.HEADER;
      component.block = mockBlock;
      component['styleBlock']();
      expect(component.blockStyle).toEqual(BlockStyle.HEADER);
    });
  });
});
