import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { RegisterPageComponent } from '../pages/register-page/register-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  // { path: 'register', component: RegisterPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
