import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCardComponent } from './document-card.component';
import { DocumentOptionsComponent } from './document-options/document-options.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentFactoryService } from '../../services/document/factory/document-factory.service';
import { DocumentImpl } from 'src/app/classes/document/document-impl';
import { configureTestSuite } from 'ng-bullet';

const uuidv4 = require('uuid/v4');

describe('DocumentCardComponent', () => {
  let component: DocumentCardComponent;
  let fixture: ComponentFixture<DocumentCardComponent>;
  let documentFactory: DocumentFactoryService;
  let routerSpy;
  const documentId = uuidv4();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentCardComponent,
        DocumentOptionsComponent
       ],
       imports: [
        RouterTestingModule.withRoutes([])
       ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCardComponent);
    component = fixture.componentInstance;
    documentFactory = TestBed.get(DocumentFactoryService);
    component.document = documentFactory.convertRawDocument({
      id: documentId,
      ownerId: uuidv4()
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should set the title if it does not exist', () => {
      expect(component.title).toBe('Untitled');
    });

    it('should set the title if it exist', () => {
      const title = 'test document';
      component.document = new DocumentImpl({title});
      component.ngOnInit();
      expect(component.title).toBe(title);
    });
  });

  /* tslint:disable:no-string-literal */
  it('navigateToDocument() - should navigate to the right path', () => {
    routerSpy = spyOn(component['router'], 'navigate');
    component.navigateToDocument();
    const navigatedPath = routerSpy.calls.mostRecent().args[0];
    expect(navigatedPath).toEqual(['/document', documentId]);
  });
});
