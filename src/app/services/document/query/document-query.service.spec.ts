import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { DocumentQueryService } from './document-query.service';
import { take } from 'rxjs/operators';
import { getDocument } from 'src/graphql/queries';
import { processTestError } from 'src/app/classes/test-helpers.spec';


describe('DocumentQueryService', () => {
  let service: DocumentQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(DocumentQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDocument$', () => {

    /* tslint:disable:no-string-literal */
    it('should return an observable with the initial value of null', done => {
      const id = 'test-id';
      // First spy on the graphql service
      const spy = spyOn(service['graphQlService'], 'query');
      spy.and.returnValue(new Promise((_, __) => { })); // never resolves
      const subscriptionSpy = spyOn(service['graphQlService'], 'getSubscription');
      subscriptionSpy.and.returnValue(new Subject());
      // Now try to get the document
      service.getDocument$(id).pipe(take(1)).subscribe(document => {
        expect(document).toBe(null);
        // check that it's calling graphQlService with the right
        // arguments
        expect(spy.calls.mostRecent().args[0]).toEqual(getDocument);
        expect(spy.calls.mostRecent().args[1]).toEqual({ id });
        done();
      }, error => processTestError(
        'error getting document', error, done
      ));
    });

  });

});
