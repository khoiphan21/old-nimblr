import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPageComponent } from './document-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ServicesModule } from '../../modules/services.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import { DocumentQueryService } from '../../services/document/query/document-query.service';
import { AccountService } from '../../services/account/account.service';
import { MockAccountService } from 'src/app/services/account/account-impl.service.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class MockDocumentQueryService {
  getDocument$() {
    return new Subject();
  }
}

describe('DocumentPageComponent', () => {
  let component: DocumentPageComponent;
  let fixture: ComponentFixture<DocumentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentPageComponent,
      ],
      imports: [
        ServicesModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: DocumentQueryService,
          useClass: MockDocumentQueryService
        },
        {
          provide: AccountService,
          useClass: MockAccountService
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  it('should create', done => {
    fixture = TestBed.createComponent(DocumentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    done();
  });
});
