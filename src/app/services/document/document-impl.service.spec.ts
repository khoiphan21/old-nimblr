import { TestBed } from '@angular/core/testing';

import { DocumentServiceImpl } from './document-impl.service';
import { AccountService } from '../account/account.service';
import { ServicesModule } from 'src/app/modules/services.module';

import { RouterTestingModule } from '@angular/router/testing';
import { GraphQLService } from '../graphQL/graph-ql.service';

describe('DocumentService', () => {
  let service: DocumentServiceImpl;
  let accountService: AccountService;
  let graphQlService: GraphQLService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentServiceImpl
      ],
      imports: [
        ServicesModule,
        RouterTestingModule.withRoutes([])
      ]
    });

    accountService = TestBed.get(AccountService);
    service = TestBed.get(DocumentServiceImpl);
    graphQlService = TestBed.get(GraphQLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have an observable current document', () => {
    expect(service.getCurrentDocument$()).toBeTruthy();
  });

});
