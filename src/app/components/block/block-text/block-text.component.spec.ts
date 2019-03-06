import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTextComponent } from './block-text.component';
import { FormsModule } from '@angular/forms';

describe('BlockTextComponent', () => {
  let component: BlockTextComponent;
  let fixture: ComponentFixture<BlockTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockTextComponent ],
      imports: [
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
