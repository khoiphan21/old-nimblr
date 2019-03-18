import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockComponent } from './block.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BlockQueryService } from '../../services/block/query/block-query.service';
import { MockBlockQueryService } from 'src/app/services/block/query/block-query.service.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BlockComponent', () => {
  let component: BlockComponent;
  let fixture: ComponentFixture<BlockComponent>;

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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
