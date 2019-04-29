import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentOutlineTabComponent } from './document-outline-tab.component';
import { uuidv4 } from '../../../classes/uuidv4';
import { RouterTestingModule } from '@angular/router/testing';
import { BlockFactoryService } from '../../../services/block/factory/block-factory.service';
import { Block } from '../../../classes/block/block';
import { BehaviorSubject } from 'rxjs';

describe('DocumentOutlineTabComponent', () => {
  let component: DocumentOutlineTabComponent;
  let fixture: ComponentFixture<DocumentOutlineTabComponent>;
  let factory: BlockFactoryService;
  let getBlockSpy: jasmine.Spy;
  let block: Block;
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
    fixture = TestBed.createComponent(DocumentOutlineTabComponent);
    component = fixture.componentInstance;
    getBlockSpy = spyOn(component['blockQueryService'], 'getBlock$').and.returnValue(new BehaviorSubject(block));
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
