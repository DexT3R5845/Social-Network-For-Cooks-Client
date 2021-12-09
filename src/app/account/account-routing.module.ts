import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LayoutComponent } from './layout/layout.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {ConfirmModeratorComponent} from "./confirm-moderator/confirm-moderator.component";

const routes: Routes = [{
  path: '', component: LayoutComponent,
  children: [
    {path:'forgot-password', component: ForgotPasswordComponent},
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent},
    { path: 'reset-password/:token', component: ResetPasswordComponent },
    { path: 'confirm-moderator/:token', component: ConfirmModeratorComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule { }
