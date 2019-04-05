import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockComponent, CreateBlockEvent } from './block.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BlockQueryService } from '../../services/block/query/block-query.service';
import { MockBlockQueryService } from 'src/app/services/block/query/block-query.service.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';
import { BlockType } from 'src/API';

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
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BlockComponent,
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        {
          provide: BlockQueryService,
          useClass: MockBlockQueryService
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockComponent);
    blockFactoryService = TestBed.get(BlockFactoryService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* tslint:disable:no-string-literal */
  describe('ngOnInit()', () => {
    let block;
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

    it('should set isFocused to true if focusBlockId matches', () => {
      component.focusBlockId = block.id;
      component.ngOnInit();
      subject.next(block);
      expect(component.isFocused).toBe(true);
    });
  });

  it('toggleBlockOptions() - should set `isBlockOptionsShown` to the given value', () => {
    component.isSelectedOptionShown = false;
    component.toggleBlockOptions(true);
    expect(component.isBlockOptionsShown).toBe(true);
  });

  it('toggleSelectedOptionStatus() - should set `isSelectedOptionShown` to the given value', () => {
    component.toggleSelectedOptionStatus(true);
    expect(component.isSelectedOptionShown).toBe(true);
  });

  describe('addBlock()', () => {
    it('should emit the right type', done => {
      const type = BlockType.QUESTION;
      component.createBlock.subscribe((value: CreateBlockEvent) => {
        expect(value.type).toEqual(type);
        done();
      });
      component.addBlock(type);
    });
    it('should emit the right id', done => {
      component.blockId = uuidv4();
      component.createBlock.subscribe((value: CreateBlockEvent) => {
        expect(value.id).toEqual(component.blockId);
        done();
      });
      component.addBlock(BlockType.TEXT);
    });
  });

  describe('deleteTransmitter()', () => {
    const id = 'test';

    it('should emit the given blockId', done => {
      component.deleteEvent.subscribe(value => {
        expect(value).toEqual(id);
        done();
      });
      component.deleteTransmitter(id);
    });
  });
});
