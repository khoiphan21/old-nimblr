import { TestBed } from '@angular/core/testing';

import { DocumentQueryService } from './document-query.service';
import { BehaviorSubject } from 'rxjs';
import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from '../account/account-impl.service.spec';
import { GraphQLService } from '../graphQL/graph-ql.service';
import { createDocument, deleteDocument } from '../../../graphql/mutations';
import { CreateDocumentInput, DocumentType } from '../../../API';
import { take } from 'rxjs/operators';

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
        // Create a document
        // update the document
        // Check for notification
        // delete the document
        fail('test to be written');
      }, error => { fail('unable to get service'); console.error(error); done(); });
    });
  });

});
