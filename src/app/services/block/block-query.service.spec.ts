import { TestBed } from '@angular/core/testing';

import { BlockQueryService } from './block-query.service';
import { take, skip } from 'rxjs/operators';
import { TextBlock, Block } from '../../classes/block';
import { BehaviorSubject } from 'rxjs';
import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';

const uuidv4 = require('uuid/v4');

export const TEST_TEXT_BLOCK_ID = '25755a43-0383-4030-bae4-d454adbab6bd';

describe('BlockQueryService', () => {
  const service$ = new BehaviorSubject(null);

  beforeAll(() => {
    TestBed.configureTestingModule({});
    Auth.signIn(TEST_USERNAME, TEST_PASSWORD).then(() => {
      service$.next(TestBed.get(BlockQueryService))
    });
  });

  beforeEach(() => {
    service$.next(TestBed.get(BlockQueryService))
  });

  it('should be created', () => {
    const service = TestBed.get(BlockQueryService);
    expect(service).toBeTruthy();
  });

  describe('getBlock$', () => {

    it('should return an observable with initial value null', done => {
      const id = uuidv4();
      service$.subscribe(service => {
        if (service === null) { return; }
        service.getBlock$(id).pipe(take(1)).subscribe(value => {
          expect(value).toBe(null);
          done();
        }, error => { fail(error); done(); });
      })
    });

    it('should return a valid block if the id is correct', done => {
      service$.subscribe(service => {
        if (service === null) { return; }
        service.getBlock$(TEST_TEXT_BLOCK_ID).pipe(skip(1)).pipe(take(1)).subscribe(value => {
          checkTextBlock(value, TEST_TEXT_BLOCK_ID);
          done();
        }, error => { fail(error); done(); });
      });
    });

    function checkTextBlock(givenObject, id: string) {
      expect(givenObject instanceof TextBlock).toBe(true); // should be a TextBlock
      expect(givenObject.id).toEqual(id);
    }

    it('should store the retrieved block in the internal map', done => {
      service$.subscribe(service => {
        if (service === null) { return; }
        service.getBlock$(TEST_TEXT_BLOCK_ID).pipe(skip(1)).pipe(take(1)).subscribe(() => {
          /* tslint:disable:no-string-literal */
          const observable = service['blocksMap'].get(TEST_TEXT_BLOCK_ID);
          expect(observable.subscribe).toBeTruthy(); // Make sure it's an observable
          observable.pipe(take(1)).subscribe(block => {
            checkTextBlock(block, TEST_TEXT_BLOCK_ID);
            done();
          });
        }, error => { fail(error); done(); });
      });
    });

    it('should not call backend again if it already called once', done => {
      service$.subscribe(service => {
        if (service === null) { return; }
        service.getBlock$(TEST_TEXT_BLOCK_ID).pipe(skip(1)).pipe(take(1)).subscribe(() => {
          /* tslint:disable:no-string-literal */
          // Spy on the query method of the graphQlService
          const spy = spyOn(service['graphQlService'], 'query').and.returnValue(Promise.resolve());
          // Check return value
          service.getBlock$(TEST_TEXT_BLOCK_ID).pipe(take(1)).subscribe(block => {
            // Check relevant values
            checkTextBlock(block, TEST_TEXT_BLOCK_ID);
            // Check that the query method should not have been called
            expect(spy.calls.count()).toEqual(0);
            done();
          });
        }, error => { fail(error); done(); });
      });
    });

    it('should notify when there is an update on a block', done => {
      fail('test to be written');
      done();
    });
  });
});
