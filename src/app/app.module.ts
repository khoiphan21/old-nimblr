import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppRoutingModule } from './modules/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
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
import { BlockHeaderComponent } from './components/block/block-header/block-header.component';
import { DocumentOptionsComponent } from './components/document-card/document-options/document-options.component';
import { QuestionBlockComponent } from './components/block/question-block/question-block.component';
import { DropdownComponent } from './components/block/question-block/dropdown/dropdown.component';
import { CheckboxComponent } from './components/block/question-block/checkbox/checkbox.component';
import { MultipleChoiceComponent } from './components/block/question-block/multiple-choice/multiple-choice.component';

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
    BlockHeaderComponent,
    DocumentOptionsComponent,
    QuestionBlockComponent,
    CheckboxComponent,
    DropdownComponent,
    MultipleChoiceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    ServicesModule,
    ClickOutsideModule,
    BrowserAnimationsModule
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
