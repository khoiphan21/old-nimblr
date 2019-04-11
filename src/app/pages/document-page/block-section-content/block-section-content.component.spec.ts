import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockSectionContentComponent } from './block-section-content.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BlockSectionContentComponent', () => {
  let component: BlockSectionContentComponent;
  let fixture: ComponentFixture<BlockSectionContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockSectionContentComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockSectionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
