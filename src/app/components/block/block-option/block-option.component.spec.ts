import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockOptionComponent } from './block-option.component';
import { BlockType, TextBlockType } from 'src/API';
import { take } from 'rxjs/operators';
import { CreateBlockEvent } from '../createBlockEvent';
import { configureTestSuite } from 'ng-bullet';
import { RouterTestingModule } from '@angular/router/testing';
import { Block } from 'src/app/classes/block/block';
import { BlockFactoryService } from '../../../services/block/factory/block-factory.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { TextBlock } from '../../../classes/block/textBlock';

const uuidv4 = require('uuid/v4');

describe('BlockOptionComponent', () => {
  let component: BlockOptionComponent;
  let fixture: ComponentFixture<BlockOptionComponent>;
  let factory: BlockFactoryService;
  let toggleSpy: jasmine.Spy;
  let getBlockSpy: jasmine.Spy;
  let block: Block;
  const documentId = uuidv4();
  const lastUpdatedBy = uuidv4();
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [BlockOptionComponent],
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    })
      .compileComponents();
  });

  /* tslint:disable:no-string-literal */
  beforeEach(() => {
    factory = TestBed.get(BlockFactoryService);
    fixture = TestBed.createComponent(BlockOptionComponent);
    component = fixture.componentInstance;
    block = factory.createNewTextBlock({documentId, lastUpdatedBy});
    getBlockSpy = spyOn(component['blockQueryService'], 'getBlock$').and.returnValue(new BehaviorSubject(block));
    toggleSpy = spyOn<any>(component, 'toggleSelectedOptionsStatus');
    component.blockId = block.id;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should get a valid block if it is not empty', () => {
      component.ngOnInit();
      expect(component.block).toEqual(block);
    });

    it('should catch the error', () => {
      const subject = new Subject();
      getBlockSpy.and.returnValue(subject);
      spyOn(console, 'error');
      component.ngOnInit();
      subject.error('test');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges() -', () => {
    beforeEach(() => {
      component.ngOnChanges();
    });

    it('should change `isAddBlockContainerShown` to false', () => {
      expect(component.isAddBlockContainerShown).toBe(false);
    });

    it('should change `isMenuSelectionContainerShown` to false', () => {
      expect(component.isMenuSelectionContainerShown).toBe(false);
    });

    it('should set value to true if `mouseFocusingBlock` is same as `blockID`', () => {
      component.mouseFocusingBlock = 'id123';
      component.blockId = 'id123';
      component.ngOnChanges();
      expect(component.showBlock).toBe(true);
    });

    it('should set value to false if `mouseFocusingBlock` is not the same as `blockID`', () => {
      component.mouseFocusingBlock = 'id123';
      component.blockId = 'id098';
      component.ngOnChanges();
      expect(component.showBlock).toBe(false);
    });
  });

  describe('showAddBlockContainer() -', () => {
    beforeEach(() => {
      component.showAddBlockContainer();
    });

    it('should change `isAddBlockContainerShown` to true', () => {
      expect(component.isAddBlockContainerShown).toBe(true);
    });

    /* tslint:disable:no-string-literal */
    it('should call toggleSelectedOptionsStatus() with the right value', () => {
      expect(component['toggleSelectedOptionsStatus']).toHaveBeenCalledWith(true);
    });
  });

  describe('hideAddBlockContainer() -', () => {
    beforeEach(() => {
      component.isAddBlockContainerShown = true;
      component.hideAddBlockContainer();
    });

    it('should change `isAddBlockContainerShown` to false', () => {
      expect(component.isAddBlockContainerShown).toBe(false);
    });

    /* tslint:disable:no-string-literal */
    it('should call toggleSelectedOptionsStatus() with the right value', () => {
      expect(component['toggleSelectedOptionsStatus']).toHaveBeenCalledWith(false);
    });

    it('should emit the right value to parent', done => {
      component.switchBlockOptionsOff.subscribe((value) => {
        expect(value).toEqual(false);
        done();
      });
      component.isAddBlockContainerShown = true;
      component.hideAddBlockContainer();
    });
  });

  describe('showMenuSelectionContainer() -', () => {
    beforeEach(() => {
      component.showMenuSelectionContainer();
    });

    it('should change `isMenuSelectionContainerShown` to true', () => {
      expect(component.isMenuSelectionContainerShown).toBe(true);
    });

    /* tslint:disable:no-string-literal */
    it('should call toggleSelectedOptionsStatus() with the right value', () => {
      expect(component['toggleSelectedOptionsStatus']).toHaveBeenCalledWith(true);
    });
  });

  describe('hideMenuSelectionContainer() -', () => {
    beforeEach(() => {
      component.isMenuSelectionContainerShown = true;
      component.hideMenuSelectionContainer();
    });

    it('should change `isMenuSelectionContainerShown` to false', () => {
      expect(component.isMenuSelectionContainerShown).toBe(false);
    });

    /* tslint:disable:no-string-literal */
    it('should call toggleSelectedOptionsStatus() with the right value', () => {
      expect(component['toggleSelectedOptionsStatus']).toHaveBeenCalledWith(false);
    });

    it('should emit the right value to parent', done => {
      component.switchBlockOptionsOff.pipe(take(1)).subscribe(value => {
        expect(value).toEqual(false);
        done();
      });
      // First set this to true, otherwise it will not run the code
      component.isMenuSelectionContainerShown = true;
      component.hideMenuSelectionContainer();
    });
  });

  it('toggleSelectedOptionsStatus() - should emit the right value to parent', () => {
    toggleSpy.and.callThrough();
    const spy = spyOn(component.isSelectedOptionShown, 'emit');
    component['toggleSelectedOptionsStatus'](false);
    expect(spy).toHaveBeenCalledWith(false);
  });

  describe('add new block', () => {
    let hideSpy: jasmine.Spy;

    beforeEach(() => {
      hideSpy = spyOn(component, 'hideAddBlockContainer');
    });

    describe('addTextBlock()', () => {
      it('should emit a BlockType.TEXT event', done => {
        component.createBlock.pipe(take(1)).subscribe(value => {
          expect(value.type).toEqual(BlockType.TEXT);
          done();
        });
        component.addTextBlock();
      });
      it('should call to hide the container', () => {
        component.addTextBlock();
        expect(hideSpy).toHaveBeenCalled();
      });
    });

    describe('addQuestionBlock()', () => {
      it('should emit a CreateBlockInfo event', done => {
        component.createBlock.pipe(take(1)).subscribe(value => {
          expect(value.type).toEqual(BlockType.QUESTION);
          done();
        });
        component.addQuestionBlock();
      });

      it('should call to hide the container', () => {
        component.addQuestionBlock();
        expect(hideSpy).toHaveBeenCalled();
      });
    });

    describe('addHeaderBlock()', () => {
      it('should emit a CreateBlockInfo event', done => {
        const expectedInfo: CreateBlockEvent = {
          type: BlockType.TEXT,
          id: component.blockId,
          textBlockType: TextBlockType.HEADER,
        };
        component.createBlock.pipe(take(1)).subscribe(value => {
          expect(value).toEqual(expectedInfo);
          done();
        });
        component.addHeaderBlock();
      });

      it('should call to hide the container', () => {
        component.addHeaderBlock();
        expect(hideSpy).toHaveBeenCalled();
      });

    });
  });

  describe('deleteHandler()', () => {
    it('should emit the block id', done => {
      component.deleteEvent.subscribe(value => {
        expect(value).toEqual(component.blockId);
        done();
      });
      component.deleteHandler();
    });
  });

  describe('convertBlockInto()', () => {
    let updateBlockUISpy: jasmine.Spy;
    let updateBlockSpy: jasmine.Spy;
    let hideMenuSpy: jasmine.Spy;
    beforeEach(() => {
      updateBlockUISpy = spyOn(component['blockQueryService'], 'updateBlockUI');
      updateBlockSpy = spyOn(component['blockCommandService'], 'updateBlock').and.returnValue(Promise.resolve());
      hideMenuSpy = spyOn(component, 'hideMenuSelectionContainer');
      component.convertBlockInto(TextBlockType.HEADER);
    });

    it('should call hideMenuSelectionContainer()', () => {
      expect(hideMenuSpy).toHaveBeenCalled();
    });

    describe('should call updateBlockUI() with the right argument', () => {
      let argument: TextBlock;
      beforeEach(() => {
        argument = updateBlockUISpy.calls.mostRecent().args[0];
      });

      it('should have the right id', () => {
        expect(argument.id).toEqual(block.id);
      });

      it('should have the right TextBlockType', () => {
        expect(argument.textBlockType).toEqual(TextBlockType.HEADER);
      });
    });

    describe('should call updateBlock() with the right argument', () => {
      let argument: TextBlock;
      beforeEach(() => {
        argument = updateBlockSpy.calls.mostRecent().args[0];
      });

      it('should have the right id', () => {
        expect(argument.id).toEqual(block.id);
      });

      it('should have the right TextBlockType', () => {
        expect(argument.textBlockType).toEqual(TextBlockType.HEADER);
      });
    });
  });

});
