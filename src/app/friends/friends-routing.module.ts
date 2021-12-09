import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {ViewFriendsComponent} from "./view-friends/view-friends.component";
import {SearchAccountComponent} from "./search-account/search-account.component";

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {path: 'view-friends', component: ViewFriendsComponent},
      {path: 'search', component: SearchAccountComponent}
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FriendsRoutingModule {
}
