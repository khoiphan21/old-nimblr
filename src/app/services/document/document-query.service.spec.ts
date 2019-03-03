import { TestBed } from '@angular/core/testing';

import { DocumentQueryService } from './document-query.service';
import { BehaviorSubject } from 'rxjs';
import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { createDocument, deleteDocument } from '../../../graphql/mutations';
import { CreateDocumentInput, DocumentType } from '../../../API';
import { take, skip } from 'rxjs/operators';
import { DocumentQueryTestHelper } from './helper';
import { processTestError } from '../../classes/helpers';
import { Document } from 'src/app/classes/document';
import { environment } from '../../../environments/environment';

describe('DocumentQueryService', () => {
  const service$ = new BehaviorSubject<DocumentQueryService>(null);
  let graphQlService: GraphQLService;
  TestBed.configureTestingModule({});

  beforeAll(() => {
    Auth.signIn(TEST_USERNAME, TEST_PASSWORD).then(() => {
      service$.next(TestBed.get(DocumentQueryService));
    });
  });

  beforeEach(() => {
    graphQlService = TestBed.get(GraphQLService);
  });

  it('should be created', () => {
    const service: DocumentQueryService = TestBed.get(DocumentQueryService);
    expect(service).toBeTruthy();
  });

  describe('getDocument$', () => {

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
      service$.subscribe(service => {
        if (service === null) { return; }
        let id: string;
        const input: CreateDocumentInput = {
          type: DocumentType.FORM,
          title: 'created from getDocument$ test'
        };
        // First create a document
        graphQlService.query(createDocument, { input }).then(response => {
          const createdDocument = response.data.createDocument;
          id = createdDocument.id;
          // Now try to retrieve it in the query service
          service.getDocument$(id).subscribe(document => {
            if (document === null) { return; }
            expect(document.id).toEqual(id);
            expect(document.title).toEqual(input.title);

            // finally delete the document
            graphQlService.query(deleteDocument, { input: { id } }).then(response => {
              expect(response.data.deleteDocument.id).toEqual(id);
              done();
            }).catch(error => {
              fail('error deleting document');
              console.error(error);
              done();
            });
          }, error => {
            fail('error getting document observable');
            console.error(error);
            done();
          });
        }).catch(error => {
          fail('Check console for more details');
          console.error(error); done();
        });
      }, error => { fail('unable to get service'); console.error(error); done(); });
    });

    it('should subscribe to any changes from the backend', done => {
      service$.subscribe(service => {
        if (service === null) { return; }
        const helper = new DocumentQueryTestHelper(TestBed.get(GraphQLService));
        let document: any;
        const input: CreateDocumentInput = {
          type: DocumentType.FORM
        };
        const title = 'title from getDocument$ subscription test';
        // Create a document
        helper.sendCreateDocument(input).then(createdDocument => {
          document = createdDocument;
          // Setup to test subscription
          service.getDocument$(document.id).subscribe(notifiedDocument => {
            if (notifiedDocument === null) { return; }
            // Check for notification
            if (notifiedDocument.title === title) {
              // received the latest update
              done();
            }
          });
          return getFirstDocument(document.id, service);
        }).then(() => {
          // Now update the document
          return helper.sendUpdateDocument({
            id: document.id, title
          }, environment.WAIT_TIME_BEFORE_UPDATE);
        }).then(() => {
          return helper.deleteDocument();
        }).catch(error => processTestError('error during logic step', error, done));
      }, error => processTestError('unable to get service', error, done));
    }, environment.TIMEOUT_FOR_UPDATE_TEST);

    async function getFirstDocument(
      id: string, service: DocumentQueryService
    ): Promise<Document> {
      return new Promise((resolve, reject) => {
        service.getDocument$(id).subscribe(document => {
          if (document === null) { return; }
          resolve(document);
        }, error => reject(error));
      });
    }

  });

});
