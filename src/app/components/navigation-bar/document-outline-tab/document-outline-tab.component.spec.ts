import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentOutlineTabComponent } from './document-outline-tab.component';
import { uuidv4 } from '../../../classes/uuidv4';
import { RouterTestingModule } from '@angular/router/testing';
import { BlockFactoryService } from '../../../services/block/factory/block-factory.service';
import { Block } from '../../../classes/block/block';
import { BehaviorSubject, Subject } from 'rxjs';

describe('DocumentOutlineTabComponent', () => {
  let component: DocumentOutlineTabComponent;
  let fixture: ComponentFixture<DocumentOutlineTabComponent>;
  let factory: BlockFactoryService;
  let getBlockSpy: jasmine.Spy;
  let block: Block;
  let headerBlock: Block;
  const documentId = uuidv4();
  const lastUpdatedBy = uuidv4();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentOutlineTabComponent ],
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    })
    .compileComponents();
  }));

  /* tslint:disable:no-string-literal */
  beforeEach(() => {
    factory = TestBed.get(BlockFactoryService);
    block = factory.createNewTextBlock({documentId, lastUpdatedBy});
    headerBlock = factory.createNewHeaderBlock({documentId, lastUpdatedBy});
    fixture = TestBed.createComponent(DocumentOutlineTabComponent);
    component = fixture.componentInstance;
    getBlockSpy = spyOn(component['blockQueryService'], 'getBlock$').and.returnValue(new BehaviorSubject(block));
    component.id = uuidv4();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should set the title if the block returned is not empty', () => {
      component.ngOnInit();
      expect(component.title).toEqual('');
    });

    it('should set isHeader to false if valid', () => {
      component.ngOnInit();
      expect(component.isHeader).toBe(false);
    });

    it('should set isHeader to true if valid', () => {
      getBlockSpy.and.returnValue(new BehaviorSubject(headerBlock));
      component.ngOnInit();
      expect(component.isHeader).toBe(true);
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

  describe('scrollToSection()', () => {
    let getElementSpy: jasmine.Spy;
    beforeEach(() => {
      const dummyElement = document.createElement('div');
      getElementSpy = spyOn(document, 'getElementById').and.returnValue(dummyElement);
    });
    it('should call the getElementById() with the right arguement', () => {
      const uuid = uuidv4();
      component.scrollToSection(uuid);
      expect(getElementSpy).toHaveBeenCalledWith(uuid);
    });
  });

});
