import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterPageComponent } from '../pages/register-page/register-page.component';
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { DashboardPageComponent } from '../pages/dashboard-page/dashboard-page.component';
import { DocumentPageComponent } from '../pages/document-page/document-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'document/:id', component: DocumentPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
