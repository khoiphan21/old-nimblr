import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockSectionContentComponent } from './block-section-content.component';

describe('BlockSectionContentComponent', () => {
  let component: BlockSectionContentComponent;
  let fixture: ComponentFixture<BlockSectionContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockSectionContentComponent ]
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
