import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPageComponent } from './document-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ServicesModule } from '../../modules/services.module';
import { BlockOptionComponent } from '../../components/block/block-option/block-option.component';
import { BlockComponent } from '../../components/block/block.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { NavigationBarComponent } from '../../components/navigation-bar/navigation-bar.component';

describe('DocumentPageComponent', () => {
  let component: DocumentPageComponent;
  let fixture: ComponentFixture<DocumentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentPageComponent,
        BlockOptionComponent,
        BlockComponent,
        HeaderComponent,
        NavigationBarComponent
      ],
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([])
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentPageComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.get(Router), 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
