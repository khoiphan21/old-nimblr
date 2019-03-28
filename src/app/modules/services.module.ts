import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import Amplify from '@aws-amplify/core';

import awsmobile from '../../aws-exports.js';
import { AccountService } from '../services/account/account.service';
import { AccountServiceImpl } from '../services/account/account-impl.service';
import { GraphQLService } from '../services/graphQL/graph-ql.service';
import { GraphQlCommandService } from '../services/graphQL/graph-ql-command.service';

// Update the authentication type to IAM
awsmobile.aws_appsync_authenticationType = 'AWS_IAM';
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
    GraphQlCommandService,
    {
      provide: AccountService,
      useClass: AccountServiceImpl
    }
  ],
})
export class ServicesModule { }
