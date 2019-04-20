import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionRecipientComponent } from './submission-recipient.component';
import { BehaviorSubject } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

// tslint:disable:no-string-literal
describe('SubmissionRecipientComponent', () => {
  let component: SubmissionRecipientComponent;
  let fixture: ComponentFixture<SubmissionRecipientComponent>;
  let document$: BehaviorSubject<any>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SubmissionRecipientComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionRecipientComponent);
    component = fixture.componentInstance;
    // Spy on the queryService first
    document$ = new BehaviorSubject(null);
    spyOn(component['queryService'], 'getDocument$').and.returnValue(document$);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('storeDocumentContent()', () => {
    describe('when arg is null', () => {
      beforeEach(() => {
        component.storeDocumentContent(null);
      });

      it('should not set isRecipientReady if arg is null', () => {
        expect(component.isRecipientReady).toBe(undefined);
      });
      it('should leave the default email to undefined if arg is null', () => {
        expect(component.recipientEmail).toBe(undefined);
      });
    });

    describe('when arg is not null', () => {
      let input: any;
      beforeEach(() => {
        input = {
          recipientEmail: 'test@email.com'
        };
        component.storeDocumentContent(input);
      });
      it('should set the recipientEmail', () => {
        expect(component.recipientEmail).toEqual(input.recipientEmail);
      });
      it('should set isRecipientReady to be true', () => {
        expect(component.isRecipientReady).toBe(true);
      });
    });
  });

  describe('navigate()', () => {
    it('should emit the documentId', done => {
      const id = 'test';
      component.documentId = id;
      component.navigateToEvent.subscribe(value => {
        expect(value).toEqual(id);
        done();
      });
      component.navigate();
    });
  });
});
