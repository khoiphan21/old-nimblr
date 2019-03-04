import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPageComponent } from './document-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ServicesModule } from '../../modules/services.module';
import { BlockOptionComponent } from '../../components/block/block-option/block-option.component';
import { BlockComponent } from '../../components/block/block.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { NavigationBarComponent } from '../../components/navigation-bar/navigation-bar.component';
import { BlockHeaderComponent } from '../../components/block/block-header/block-header.component';
import { BlockTextComponent } from '../../components/block/block-text/block-text.component';
import { DocumentOptionsComponent } from '../../components/document-card/document-options/document-options.component';
import { QuestionBlockComponent } from '../../components/block/question-block/question-block.component';
import { DropdownComponent } from '../../components/block/question-block/dropdown/dropdown.component';
import { CheckboxComponent } from '../../components/block/question-block/checkbox/checkbox.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MultipleChoiceComponent } from '../../components/block/question-block/multiple-choice/multiple-choice.component';
import { Subject } from 'rxjs';

import { NavigationTabComponent } from '../../components/navigation-bar/navigation-tab/navigation-tab.component';
import { DocumentService } from 'src/app/services/document/document.service';
import { DocumentQueryService } from '../../services/document/document-query.service';

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
        BlockOptionComponent,
        BlockComponent,
        HeaderComponent,
        NavigationBarComponent,
        BlockHeaderComponent,
        BlockTextComponent,
        DocumentOptionsComponent,
        QuestionBlockComponent,
        DropdownComponent,
        CheckboxComponent,
        MultipleChoiceComponent,
        NavigationTabComponent
      ],
      imports: [
        ServicesModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: DocumentQueryService,
          useClass: MockDocumentQueryService
        }
      ]
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
