import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppRoutingModule } from './modules/app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContenteditableModule } from '@ng-stack/contenteditable';
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
import { InputBlockComponent } from './components/block/input-block/input-block.component';
import { NavigationTabComponent } from './components/navigation-bar/navigation-tab/navigation-tab.component';
import { HeaderOptionsComponent } from './components/header/header-options/header-options.component';
import { ForgetPasswordPageComponent } from './pages/forget-password-page/forget-password-page.component';
import { AddInformationComponent } from './components/block/add-information/add-information.component';
import { MobileInputBlockComponent } from './components/block/mobile-input-block/mobile-input-block.component';
import { HeaderSharingComponent } from './components/header/header-sharing/header-sharing.component';
import { SendFormComponent } from './components/send-form/send-form.component';
import { InviteCollaboratorComponent } from './components/invite-collaborator/invite-collaborator.component';
import { DocumentLoginComponent } from './components/document-login/document-login.component';
import { RequestAccessComponent } from './components/request-access/request-access.component';
import { ResponsiveModule } from 'ngx-responsive';
import { DocumentContentComponent } from './pages/document-page/document-content/document-content.component';
import { TemplateDocumentContentComponent } from './pages/document-page/template-document-content/template-document-content.component';
import { BlockSectionContentComponent } from './pages/document-page/block-section-content/block-section-content.component';
import { SubmissionDocumentContentComponent } from './pages/document-page/submission-document-content/submission-document-content.component';
import { SubmissionRecipientComponent } from './pages/document-page/template-document-content/submission-recipient/submission-recipient.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { DocumentOutlineTabComponent } from './components/navigation-bar/document-outline-tab/document-outline-tab.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { TooltipModule } from 'ng2-tooltip-directive';
import { InputOptionComponent } from './components/block/input-block/input-option/input-option.component';

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
    InputBlockComponent,
    NavigationTabComponent,
    HeaderOptionsComponent,
    ForgetPasswordPageComponent,
    AddInformationComponent,
    MobileInputBlockComponent,
    InputOptionComponent,
    HeaderSharingComponent,
    SendFormComponent,
    InviteCollaboratorComponent,
    DocumentLoginComponent,
    RequestAccessComponent,
    DocumentContentComponent,
    TemplateDocumentContentComponent,
    BlockSectionContentComponent,
    SubmissionDocumentContentComponent,
    SubmissionRecipientComponent,
    PageNotFoundComponent,
    DocumentOutlineTabComponent,
  ],
  imports: [
    BrowserModule,
    ClickOutsideModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    ServicesModule,
    BrowserAnimationsModule,
    ContenteditableModule,
    ResponsiveModule.forRoot(),
    DragDropModule,
    TooltipModule
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
