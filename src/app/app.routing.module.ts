import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthFormsGuard, AuthGuard} from './_helpers';
import {Role} from './_models/role';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);
const friendsModule = () => import('./friends/friends.module').then(x => x.FriendsModule);

const routes: Routes = [
  {path: '', redirectTo: '/account/signin', pathMatch: 'full'},
  {path: 'account', loadChildren: accountModule, canActivate: [AuthFormsGuard]},
  {path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: {roles: [Role.Admin, Role.User]}},
  {path: 'friends', loadChildren: friendsModule,canActivate: [AuthGuard]},
  {path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard]},
  {path: '**', redirectTo: '/account/signin', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
