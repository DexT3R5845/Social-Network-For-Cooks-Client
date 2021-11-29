import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LayoutComponent } from './layout/layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    ForgotPasswordComponent,
    LayoutComponent,
    SigninComponent,
    SignupComponent,
    ResetPasswordComponent
  ],
  imports: [
    AccountRoutingModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountModule { }
