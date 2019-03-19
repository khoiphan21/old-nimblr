import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockComponent } from './block.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BlockQueryService } from '../../services/block/query/block-query.service';
import { MockBlockQueryService } from 'src/app/services/block/query/block-query.service.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
    beforeEach(() => {
      block = blockFactoryService.createAppBlock(rawData);
    });

    it('should set the block into the given value if it is not empty', () => {
      spyOn<any>(component['blockQueryService'], 'getBlock$').and.callFake(() => {
        return new BehaviorSubject(block);
      });
      component.ngOnInit();
      expect(component.block).toEqual(block);
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
});
