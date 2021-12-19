import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {ViewFriendsComponent} from "./view-friends/view-friends.component";
import {SearchAccountComponent} from "./search-account/search-account.component";
import {InvitesComponent} from "./invites/invites.component";

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {path: 'search', component: SearchAccountComponent},
      {path: 'view-friends', component: ViewFriendsComponent},
      {path: 'invites', component: InvitesComponent}

    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FriendsRoutingModule {
}
