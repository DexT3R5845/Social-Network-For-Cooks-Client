import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {ViewFriendsComponent} from "./view-friends/view-friends.component";

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {path: '', component: ViewFriendsComponent}
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FriendsRoutingModule {
}
