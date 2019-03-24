import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import Amplify from '@aws-amplify/core';

import awsmobile from '../../aws-exports';
import { AccountService } from '../services/account/account.service';
import { AccountServiceImpl } from '../services/account/account-impl.service';
import { GraphQLService } from '../services/graphQL/graph-ql.service';
import { NavigationBarService } from '../services/navigation-bar/navigation-bar.service';
import { GraphQlCommandService } from '../services/graphQL/graph-ql-command.service';


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
