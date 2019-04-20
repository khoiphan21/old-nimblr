import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockOptionComponent } from './block-option.component';
import { BlockType, TextBlockType } from 'src/API';
import { take } from 'rxjs/operators';
import { CreateBlockEvent } from '../createBlockEvent';
import { configureTestSuite } from 'ng-bullet';

const uuidv4 = require('uuid/v4');

describe('BlockOptionComponent', () => {
  let component: BlockOptionComponent;
  let fixture: ComponentFixture<BlockOptionComponent>;
  let toggleSpy: jasmine.Spy;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [BlockOptionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockOptionComponent);
    component = fixture.componentInstance;

    // Set some default values
    component.blockId = uuidv4();

    toggleSpy = spyOn<any>(component, 'toggleSelectedOptionsStatus');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

});
