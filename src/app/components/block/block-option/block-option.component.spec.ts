import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockOptionComponent, CreateBlockInfo } from './block-option.component';
import { BlockType, TextBlockType } from 'src/API';
import { take } from 'rxjs/operators';
import { BlockFactoryService } from 'src/app/services/block/factory/block-factory.service';

const uuidv4 = require('uuid/v4');

describe('BlockOptionComponent', () => {
  let component: BlockOptionComponent;
  let fixture: ComponentFixture<BlockOptionComponent>;

  // Spies
  let toggleSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockOptionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockOptionComponent);
    component = fixture.componentInstance;
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

    it('should emit the right value to parent', () => {
      component.switchBlockOptionsOff.subscribe((value) => {
        expect(value).toEqual(false);
      });
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

    it('should emit the right value to parent', () => {
      component.switchBlockOptionsOff.subscribe((value) => {
        expect(value).toEqual(false);
      });
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
    let expectedInfo: CreateBlockInfo;

    beforeEach(() => {
      hideSpy = spyOn(component, 'hideAddBlockContainer');
    });

    describe('addTextBlock()', () => {
      it('should emit a BlockType.TEXT event', done => {
        expectedInfo = { type: BlockType.TEXT };

        component.createBlock.pipe(take(1)).subscribe(value => {
          expect(value).toEqual(expectedInfo);
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
        expectedInfo = { type: BlockType.QUESTION };
        component.createBlock.pipe(take(1)).subscribe(value => {
          expect(value).toEqual(expectedInfo);
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
        expectedInfo = {
          type: BlockType.TEXT,
          textblocktype: TextBlockType.HEADER,
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
    let factory: BlockFactoryService;

    beforeEach(() => {
      factory = TestBed.get(BlockFactoryService);
    });
    it('should emit the block id', done => {
      component.block = factory.createAppBlock({
        type: BlockType.TEXT,
        documentId: uuidv4(),
        lastUpdatedBy: uuidv4()
      });
      component.deleteEvent.subscribe(value => {
        expect(value).toEqual(component.block.id);
        done();
      });
      component.deleteHandler();
    });
  });

});
