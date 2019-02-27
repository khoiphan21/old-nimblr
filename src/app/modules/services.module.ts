import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import Amplify from '@aws-amplify/core';

import awsmobile from '../../aws-exports';
Amplify.configure(awsmobile);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AmplifyAngularModule
  ],
  providers: [
    AmplifyService,
  ],
})
export class ServicesModule { }
