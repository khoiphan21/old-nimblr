import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppRoutingModule } from './modules/app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContenteditableModule } from '@ng-stack/contenteditable';
import { ClickOutsideModule } from 'ng4-click-outside';
import { AppComponent } from './app.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { HeaderComponent } from './components/header/header.component';
import { DocumentCardComponent } from './components/document-card/document-card.component';
import { ServicesModule } from './modules/services.module';
import { DocumentPageComponent } from './pages/document-page/document-page.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { BlockComponent } from './components/block/block.component';
import { BlockOptionComponent } from './components/block/block-option/block-option.component';
import { BlockTextComponent } from './components/block/block-text/block-text.component';
import { DocumentOptionsComponent } from './components/document-card/document-options/document-options.component';
import { QuestionBlockComponent } from './components/block/question-block/question-block.component';
import { NavigationTabComponent } from './components/navigation-bar/navigation-tab/navigation-tab.component';
import { HeaderOptionsComponent } from './components/header/header-options/header-options.component';
import { ForgetPasswordPageComponent } from './pages/forget-password-page/forget-password-page.component';
import { AddInformationComponent } from './components/block/add-information/add-information.component';
import { MobileQuestionBlockComponent } from './components/block/mobile-question-block/mobile-question-block.component';
import { QuestionOptionComponent } from './components/block/question-block/question-option/question-option.component';
import { HeaderSharingComponent } from './components/header/header-sharing/header-sharing.component';
import { SendFormComponent } from './components/send-form/send-form.component';
import { InviteCollaboratorComponent } from './components/invite-collaborator/invite-collaborator.component';
import { DocumentLoginComponent } from './components/document-login/document-login.component';
import { RequestAccessComponent } from './components/request-access/request-access.component';
import { ResponsiveModule } from 'ngx-responsive';
import { DocumentContentComponent } from './pages/document-page/document-content/document-content.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    HeaderComponent,
    DocumentCardComponent,
    DocumentPageComponent,
    NavigationBarComponent,
    BlockComponent,
    BlockOptionComponent,
    BlockTextComponent,
    DocumentOptionsComponent,
    QuestionBlockComponent,
    NavigationTabComponent,
    HeaderOptionsComponent,
    ForgetPasswordPageComponent,
    AddInformationComponent,
    MobileQuestionBlockComponent,
    QuestionOptionComponent,
    HeaderSharingComponent,
    SendFormComponent,
    InviteCollaboratorComponent,
    DocumentLoginComponent,
    RequestAccessComponent,
    DocumentContentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    ServicesModule,
    ClickOutsideModule,
    BrowserAnimationsModule,
    ContenteditableModule,
    ResponsiveModule.forRoot()
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
