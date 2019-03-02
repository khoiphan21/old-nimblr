import { TestBed } from '@angular/core/testing';

import { BlockQueryService } from './block-query.service';
import { take, skip } from 'rxjs/operators';
import { TextBlock, Block } from '../../classes/block';
import { BehaviorSubject } from 'rxjs';
import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { UpdateTextBlockInput } from '../../../API';
import { updateTextBlock } from '../../../graphql/mutations';

const uuidv4 = require('uuid/v4');

export const TEST_TEXT_BLOCK_ID = '03dda84a-7d78-4272-97cc-fe0601075e30';

describe('BlockQueryService', () => {
  const service$ = new BehaviorSubject<BlockQueryService>(null);

  beforeAll(() => {
    TestBed.configureTestingModule({});
    Auth.signIn(TEST_USERNAME, TEST_PASSWORD).then(() => {
      service$.next(TestBed.get(BlockQueryService))
    });
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
      }, error => { fail(error); done(); });
    });

    it('should return a valid block if the id is correct', done => {
      const serviceSubscription = service$.subscribe(service => {
        if (service === null) { return; }
        service.getBlock$(TEST_TEXT_BLOCK_ID).subscribe(value => {
          if (value === null) { return; }
          checkTextBlock(value, TEST_TEXT_BLOCK_ID);
          serviceSubscription.unsubscribe();
          done();
        }, error => { fail(error); done(); });
      });
    });

    function checkTextBlock(givenObject, id: string) {
      expect(givenObject instanceof TextBlock).toBe(true); // should be a TextBlock
      expect(givenObject.id).toEqual(id);
    }

    it('should store the retrieved block in the internal map', done => {
      const serviceSubscription = service$.subscribe(service => {
        if (service === null) { return; }
        const blockSubscription = service.getBlock$(TEST_TEXT_BLOCK_ID).subscribe(value => {
          if (value === null) { return; }
          /* tslint:disable:no-string-literal */
          const observable = service['blocksMap'].get(TEST_TEXT_BLOCK_ID);
          expect(observable.subscribe).toBeTruthy(); // Make sure it's an observable
          observable.subscribe(block => {
            if (block === null) { return; }
            checkTextBlock(block, TEST_TEXT_BLOCK_ID);
            done();
          });
        }, error => { fail(error); done(); });
      });
    }, 10000);

    it('should not call backend again if it already called once', done => {
      const serviceSubscription = service$.subscribe(service => {
        if (service === null) { return; }
        service.getBlock$(TEST_TEXT_BLOCK_ID).pipe(take(1)).subscribe(value => {
          if (value === null) { return; }
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
      service$.subscribe(service => {
        if (service === null) { return; }
        let shouldUpdate = true;
        const input: UpdateTextBlockInput = {
          id: TEST_TEXT_BLOCK_ID,
          version: uuidv4(),
          lastUpdatedBy: uuidv4(),
          updatedAt: new Date().toUTCString(),
          value: 'new value'
        };
        service.getBlock$(TEST_TEXT_BLOCK_ID).subscribe(block => {
          if (block === null) { return; }
          console.log('block retrieved: ', block);
          if (shouldUpdate) {
            shouldUpdate = false;
            // Call to update the block
            const graphQLService: GraphQLService = TestBed.get(GraphQLService);
            graphQLService.query(updateTextBlock, { input }).catch(error => {
              fail(error);
              done();
            });
          } else {
            // Check if the notified block is the updated block
            expect(block.version).toEqual(input.version);
            expect(block.lastUpdatedBy).toEqual(input.lastUpdatedBy);
            expect(block.updatedAt).toEqual(input.updatedAt);
          }
          console.log(block);
        });
      });
      fail();
      done();
    });
  });
});
