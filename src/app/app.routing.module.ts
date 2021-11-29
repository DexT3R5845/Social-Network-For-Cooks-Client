import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { MainPageComponent } from './main-page/main-page.component';
import { SigninComponent } from './signin/signin.component';
import { UserFormsGuardService } from './user-forms-guard.service';
import {UserSettingsComponent} from "./user-settings/user-settings.component";
import { RegistrationComponent } from './registration/registration.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);

const routes: Routes = [
  { path: '', redirectTo: '/account/signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent, canActivate: [UserFormsGuardService]  },
  { path: 'main_page', component: MainPageComponent, canActivate: [AuthGuardService] },
  { path: 'user', component: UserSettingsComponent },
  { path: 'registration', component: RegistrationComponent, canActivate: [UserFormsGuardService] },
  { path: 'account', loadChildren: accountModule },
  { path: '**', redirectTo: '/account/signin', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
