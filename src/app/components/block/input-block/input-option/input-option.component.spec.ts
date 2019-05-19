import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject, Subject } from 'rxjs';
import { InputType } from '../../../../../API';
import { InputOptionComponent } from './input-option.component';
import { SimpleChange } from '@angular/core';
import { take } from 'rxjs/operators';


// tslint:disable:no-string-literal
fdescribe('InputOptionComponent', () => {
  let component: InputOptionComponent;
  let fixture: ComponentFixture<InputOptionComponent>;

  let mockBlock: any;
  let block$: BehaviorSubject<any>;

  let triggerUpdateSpy: jasmine.Spy;
  let updateArg: Subject<any>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [InputOptionComponent],
      imports: [ReactiveFormsModule, FormsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputOptionComponent);
    component = fixture.componentInstance;

    setupMockData();

    setupSpies();

    fixture.detectChanges();
  });

  function setupMockData() {
    mockBlock = {
      answers: ['foo'],
      options: ['foo', 'bar'],
      inputType: InputType.TEXT
    };
    block$ = new BehaviorSubject(mockBlock);
    const mockController: any = {
      getInputBlock$: () => block$,
      update: () => { }
    };

    // initialise inputs
    component['controller'] = mockController;
    component['inputType'] = mockBlock.inputType;
  }

  function setupSpies() {
    triggerUpdateSpy = spyOn(component, 'triggerUpdateValue');
    triggerUpdateSpy.and.callThrough();

    // This is needed to test that controller.update() was called
    // with the right argument
    updateArg = new Subject();
    spyOn(component['controller'], 'update')
      .and.callFake(val => updateArg.next(val));
  }

  // simulate the user typing some input into an element
  // this element can be either an `input` or contenteditable `div`
  function simulateInputEvent(element, value: string) {
    element.value = value;
    element.dispatchEvent(new Event('input'));
  }

  // wait for the first value from the updateArg observable and check
  // against the given value
  async function checkUpdateArg(expectedValue) {
    return new Promise(resolve => {
      updateArg.pipe(take(1)).subscribe(value => {
        expect(value).toEqual(expectedValue);
        resolve();
      });
    });
  }

  describe('handling block notification', () => {

    it('should generate an empty option when given empty array', async () => {
      mockBlock = {
        answers: [],
        options: [],
        inputType: InputType.MULTIPLE_CHOICE
      };
      block$.next(mockBlock);
      await checkUpdateArg({
        answers: [],
        options: [''],
        inputType: InputType.MULTIPLE_CHOICE
      });
    });

    it('should convert a `null` option to `empty` option', async () => {
      mockBlock = {
        answers: [],
        options: [null],
        inputType: InputType.MULTIPLE_CHOICE
      };
      block$.next(mockBlock);
      await checkUpdateArg({
        answers: [],
        options: [''],
        inputType: InputType.MULTIPLE_CHOICE
      });
    });

  });



  describe('when currentType is TEXT', () => {

    it('should show the text input if the type is TEXT', () => {
      const element = fixture.debugElement.query(By.css('.text-input'));
      expect(element).toBeTruthy();
    });

    it('should call to triggerUpdateValue() whenever there is input', () => {
      const inputElement = fixture.debugElement.query(By.css('.text-input'));
      const nativeElement = inputElement.nativeElement;

      simulateInputEvent(nativeElement, 'abcd');

      // now call the fixture to check the component
      fixture.detectChanges();

      expect(triggerUpdateSpy).toHaveBeenCalled();
    });
  });


  describe('ngOnChanges() - when inputType changes', () => {

    describe('from TEXT to MULTIPLE_CHOICE | CHECKBOX', () => {

      beforeEach(() => {
        component.ngOnChanges({
          inputType: new SimpleChange(InputType.TEXT, InputType.CHECKBOX, true)
        });
      });

      it('should clear the answers', () => {
        expect(component['currentAnswers']).toEqual([]);
      });

      it('should call controller.update() with the right values', done => {
        updateArg.pipe(take(1)).subscribe(value => {
          expect(value).toEqual({
            answers: [],
            options: mockBlock.options,
            inputType: InputType.CHECKBOX
          });
          done();
        });
      });

    });

    describe('from other type to TEXT', () => {

      beforeEach(() => {
        mockBlock = {
          answers: ['foo'],
          options: ['foo', 'bar'],
          inputType: InputType.CHECKBOX
        };
        block$.next(mockBlock);
        fixture.detectChanges();

        // now change the input type
        component.ngOnChanges({
          inputType: new SimpleChange(InputType.CHECKBOX, InputType.TEXT, false)
        });
      });

      it('should clear the answers array', () => {
        expect(component['currentAnswers']).toEqual([]);
      });

      it('should NOT clear the options array', () => {
        expect(component['currentOptions']).toEqual(mockBlock.options);
      });

      it('should call controller.update() with the right values', done => {
        updateArg.pipe(take(1)).subscribe(value => {
          expect(value).toEqual({
            answers: [],
            options: mockBlock.options,
            inputType: InputType.TEXT
          });
          done();
        });
      });

    });
  });


  describe('when form input changes', () => {
    let option1: HTMLInputElement;
    let option2: HTMLInputElement;

    function getOptionsForQuery(query) {
      option1 = fixture.debugElement.queryAll(By.css(query))[0].nativeElement;
      option2 = fixture.debugElement.queryAll(By.css(query))[1].nativeElement;
    }

    beforeEach(() => {
      mockBlock = {
        answers: [],
        options: ['foo', 'bar'],
        inputType: InputType.CHECKBOX
      };
      block$.next(mockBlock);
      fixture.detectChanges();

      triggerUpdateSpy.and.callThrough();
    });

    it('should call to update when the text changes', async () => {
      const input = fixture.debugElement.query(By.css(`input[type=text]`)).nativeElement;

      simulateInputEvent(input, 'new value');

      await checkUpdateArg({
        answers: [],
        options: ['new value', 'bar'],
        inputType: InputType.CHECKBOX
      });
    });

    describe('RADIO', () => {

      beforeEach(() => {
        mockBlock = {
          answers: [],
          options: ['foo', 'bar'],
          inputType: InputType.MULTIPLE_CHOICE
        };
        block$.next(mockBlock);
        fixture.detectChanges();
        getOptionsForQuery(`input[type=radio]`);
      });

      it('should call to update when a radio box is ticked', async () => {
        option1.click();

        await checkUpdateArg({
          answers: ['foo'], // <-- 'foo' should have been added like this
          options: ['foo', 'bar'],
          inputType: InputType.MULTIPLE_CHOICE
        });
      });

      it('should change the answer when another option is clicked', async () => {
        option1.click();
        option2.click();

        await checkUpdateArg({
          answers: ['bar'], // <-- 'foo' should have been added like this
          options: ['foo', 'bar'],
          inputType: InputType.MULTIPLE_CHOICE
        });
      });
    });

    describe('CHECKBOX', () => {

      beforeEach(() => {
        getOptionsForQuery(`input[type=checkbox]`);
      });

      it('should call to update when a box is ticked', async () => {
        option1.click();

        await checkUpdateArg({
          answers: ['foo'], // <-- 'foo' should have been added like this
          options: ['foo', 'bar'],
          inputType: InputType.CHECKBOX
        });
      });

      it('should add a new value in `answers` when another option is selected', async () => {
        option1.click();
        option2.click();

        await checkUpdateArg({
          answers: ['foo', 'bar'], // <-- should have been updated to this
          options: ['foo', 'bar'],
          inputType: InputType.CHECKBOX
        });
      });

      it('should remove answers when options are unticked', async () => {
        // select them
        option1.click();
        option2.click();

        // de-select them
        option1.click();
        option2.click();

        await checkUpdateArg({
          answers: [], // <-- should have been updated to this
          options: ['foo', 'bar'],
          inputType: InputType.CHECKBOX
        });
      });
    });
  });


});
