
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { RegistrationService } from './auth/registration.service';
import { RegistrationComponent } from './registration/registration.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import { SigninComponent } from './signin/signin.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { RequestInterceptor } from './interceptor';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    NgxCaptchaModule,
    HttpClientModule,
    JwtModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true},
    RegistrationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
