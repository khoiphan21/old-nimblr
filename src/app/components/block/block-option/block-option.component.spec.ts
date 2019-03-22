import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockOptionComponent } from './block-option.component';

describe('BlockOptionComponent', () => {
  let component: BlockOptionComponent;
  let fixture: ComponentFixture<BlockOptionComponent>;

  // Spies
  let toggleSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockOptionComponent ]
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
});
