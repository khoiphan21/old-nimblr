import { TestBed } from '@angular/core/testing';

import { DocumentQueryService } from './document-query.service';
import { BehaviorSubject } from 'rxjs';
import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { CreateDocumentInput, DocumentType } from '../../../API';
import { take } from 'rxjs/operators';
import { DocumentQueryTestHelper } from './helper';
import { processTestError } from '../../classes/helpers';
import { environment } from '../../../environments/environment';
import { onSpecificDocumentUpdate } from '../../../graphql/subscriptions';

const uuidv4 = require('uuid/v4');

describe('DocumentQueryService', () => {
  const service$ = new BehaviorSubject<DocumentQueryService>(null);
  let graphQlService: GraphQLService;
  TestBed.configureTestingModule({});

  beforeAll(() => {
    Auth.signIn(TEST_USERNAME, TEST_PASSWORD).then(() => {
      service$.next(TestBed.get(DocumentQueryService));
    });
  });

  async function getService(): Promise<DocumentQueryService> {
    return new Promise((resolve, reject) => {
      service$.subscribe(service => {
        if (service === null) { return; }
        resolve(service);
      }, error => reject(error));
    });
  }

  beforeEach(() => {
    graphQlService = TestBed.get(GraphQLService);
  });

  it('should be created', () => {
    const service: DocumentQueryService = TestBed.get(DocumentQueryService);
    expect(service).toBeTruthy();
  });

  describe('getDocument$', () => {
    let helper: DocumentQueryTestHelper;
    let storedDocument: any;
    let input: CreateDocumentInput;
    const title = 'title from getDocument$ subscription test';

    beforeEach(() => {
      helper = new DocumentQueryTestHelper(TestBed.get(GraphQLService));
      input = {
        id: uuidv4(),
        ownerId: uuidv4(),
        type: DocumentType.FORM
      };
    });

    it('should return an observable with the initial value of null', done => {
      service$.subscribe(service => {
        if (service === null) { return; }
        service.getDocument$('test-id').pipe(take(1)).subscribe(document => {
          expect(document).toBe(null);
          done();
        }, () => { }); // don't care about any error
      }, error => { fail('unable to get service'); console.error(error); done(); });
    });

    it('should return a previously created document', done => {
      getService().then(service => {
        // First create a document
        helper.sendCreateDocument(input).then(() => {
          return getFirstDocument(service);
        }).then(retrievedDocument => {
          expect(retrievedDocument.id).toEqual(helper.getCreatedDocument().id);
          expect(retrievedDocument.title).toEqual(helper.getCreatedDocument().title);
          return helper.deleteDocument();
        }).then(() => done()
        ).catch(error => {
          fail('Check console for more details');
          console.error(error); done();
        });
      }, error => { fail('unable to get service'); console.error(error); done(); });

      async function getFirstDocument(service: DocumentQueryService): Promise<any> {
        return new Promise((resolve, reject) => {
          service.getDocument$(helper.getCreatedDocument().id).subscribe(document => {
            if (document === null) { return; }
            resolve(document);
          }, error => reject(error));
        });
      }
    });

    it('should subscribe to any changes from the backend', done => {
      getService().then(service => {
        // Create a document
        helper.sendCreateDocument(input).then(createdDocument => {
          storedDocument = createdDocument;
          // Setup to test subscription
          setupSubscriptionTest(service);
          // Now update the document
          return helper.sendUpdateDocument({
            id: storedDocument.id, title
          }, environment.WAIT_TIME_BEFORE_UPDATE);
        }).then(() => {
          return helper.deleteDocument();
        }).catch(error => processTestError('error during logic step', error, done));
      }, error => processTestError('unable to get service', error, done));

      function setupSubscriptionTest(service: DocumentQueryService) {
        service.getDocument$(storedDocument.id).subscribe(notifiedDocument => {
          if (notifiedDocument === null) { return; }
          // Check for notification
          if (notifiedDocument.title === title) {
            // received the latest update
            done();
          } // otherwise, continue waiting for more notifications
        });
      }
    }, environment.TIMEOUT_FOR_UPDATE_TEST);

    it('should not notify for an update with a stored version', done => {
      getService().then(service => {
        helper.sendCreateDocument(input).then(createdDocument => {
          storedDocument = createdDocument;
          // setup to test subscription
          setupSubscriptionTest(service);
          // Create and register a version
          const version = uuidv4();
          service.registerUpdateVersion(version);
          // Update the document
          return helper.sendUpdateDocument({
            id: storedDocument.id, title, version
          }, environment.WAIT_TIME_BEFORE_UPDATE);
        }).then(() => {
          return helper.deleteDocument();
        }).catch(error => processTestError(
          'Error during test to check for update version', error, done
        ));
      });

      function setupSubscriptionTest(service: DocumentQueryService) {
        // Setup the default subscription from the service
        service.getDocument$(storedDocument.id).subscribe(notifiedDocument => {
          if (notifiedDocument === null) { return; }
          // Check for notification
          if (notifiedDocument.title === title) {
            fail('Should not have notified for this version');
            done();
          }
        }, error => processTestError('Error setting up subscription', error, done));

        // Setup an additional subscription to know when the test is finished
        graphQlService.getSubscription(onSpecificDocumentUpdate, { id: storedDocument.id }
        ).pipe(take(1)).subscribe(notification => {
          const document = notification.value.data.onSpecificDocumentUpdate;
          if (document.title === title) {
            setTimeout(() => done(), 500); // register the test as completed
          }
        }, error => processTestError('Error setting up subscription', error, done));
      }
    });

  });

});