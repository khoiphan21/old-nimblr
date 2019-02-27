import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPageComponent } from './dashboard-page.component';
import { HeaderComponent } from '../../components/header/header.component';
import { DocumentCardComponent } from '../../components/document-card/document-card.component';
import { ServicesModule } from '../../modules/services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardPageComponent,
        HeaderComponent,
        DocumentCardComponent
      ],
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([])
      ]
    })
    .compileComponents();

    spyOn(TestBed.get(Router), 'navigate');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
