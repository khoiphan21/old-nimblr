import { TestBed } from '@angular/core/testing';

import { BlockQueryService } from './block-query.service';
import { take, skip } from 'rxjs/operators';
import { TextBlock, Block } from '../../classes/block';
import { Observable } from 'rxjs';

const uuidv4 = require('uuid/v4');

export const TEST_TEXT_BLOCK_ID = '1e077940-25e4-4833-be3b-104e5262c17a';

fdescribe('BlockQueryService', () => {
  let service: BlockQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(BlockQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  fdescribe('getBlock$', () => {

    it('should return an observable with initial value null', done => {
      const id = uuidv4();
      service.getBlock$(id).pipe(take(1)).subscribe(value => {
        expect(value).toBe(null);
        done();
      }, error => { fail(error); done(); });
    });

    it('should return a valid block if the id is correct', done => {
      service.getBlock$(TEST_TEXT_BLOCK_ID).pipe(skip(1)).pipe(take(1)).subscribe(value => {
        checkTextBlock(value, TEST_TEXT_BLOCK_ID);
        done();
      }, error => { fail(error); done(); });
    });

    function checkTextBlock(givenObject, id: string) {
      expect(givenObject instanceof TextBlock).toBe(true); // should be a TextBlock
      expect(givenObject.id).toEqual(id);
    }

    it('should store the retrieved block in the internal map', done => {
      service.getBlock$(TEST_TEXT_BLOCK_ID).pipe(skip(1)).pipe(take(1)).subscribe(() => {
        /* tslint:disable:no-string-literal */
        const observable: Observable<Block> = service['blocksMap'].get(TEST_TEXT_BLOCK_ID);
        expect(observable.subscribe).toBeTruthy(); // Make sure it's an observable
        observable.pipe(take(1)).subscribe(block => {
          checkTextBlock(block, TEST_TEXT_BLOCK_ID);
          done();
        });
      }, error => { fail(error); done(); });
    });

    it('should not call backend again if it already called once', done => {
      service.getBlock$(TEST_TEXT_BLOCK_ID).pipe(skip(1)).pipe(take(1)).subscribe(() => {
        /* tslint:disable:no-string-literal */
        // Spy on the query method of the graphQlService
        const spy = spyOn(service['graphQlService'], 'query').and.returnValue(Promise.resolve());
        console.log(spy.calls.count());
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
    it('should notify when there is an update on a block', done => {
      fail('test to be written');
      done();
    });
  });
});
