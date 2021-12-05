import { ApplicationModule, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LayoutComponent } from './layout/layout.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ForgotPasswordComponent,
    LayoutComponent,
    SigninComponent,
    SignupComponent,
    ResetPasswordComponent,
  ],
  imports: [
    AccountRoutingModule,
    NgxCaptchaModule,
    SharedModule
  ],
})
export class AccountModule { }
