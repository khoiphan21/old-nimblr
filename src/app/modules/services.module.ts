import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../services/document/document.service';
import { DocumentServiceImpl } from '../services/document/document-impl.service';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import Amplify from '@aws-amplify/core';

import awsmobile from '../../aws-exports';
import { AccountService } from '../services/account/account.service';
import { AccountServiceImpl } from '../services/account/account-impl.service';
import { GraphQLService } from '../services/graphQL/graph-ql.service';
Amplify.configure(awsmobile);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AmplifyAngularModule
  ],
  providers: [
    AmplifyService,
    GraphQLService,
    {
      provide: DocumentService,
      useClass: DocumentServiceImpl
    },
    {
      provide: AccountService,
      useClass: AccountServiceImpl
    }
  ],
})
export class ServicesModule { }
