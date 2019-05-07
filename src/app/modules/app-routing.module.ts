import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterPageComponent } from '../pages/register-page/register-page.component';
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { DashboardPageComponent } from '../pages/dashboard-page/dashboard-page.component';
import { DocumentPageComponent } from '../pages/document-page/document-page.component';
import { ForgetPasswordPageComponent } from '../pages/forget-password-page/forget-password-page.component';
import { DocumentContentComponent } from '../pages/document-page/document-content/document-content.component';
import { PageNotFoundComponent } from '../pages/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'forgot-password', component: ForgetPasswordPageComponent },
  {
    path: 'document/:id', component: DocumentPageComponent,
    children: [
      {path: ':id', component: DocumentContentComponent}
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
