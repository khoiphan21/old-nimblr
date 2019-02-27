import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockOptionComponent } from './block-option.component';

describe('BlockOptionComponent', () => {
  let component: BlockOptionComponent;
  let fixture: ComponentFixture<BlockOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
