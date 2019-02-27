import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng4-click-outside';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './modules/app-routing.module';
import { ServicesModule } from './modules/services.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    ClickOutsideModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServicesModule
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
