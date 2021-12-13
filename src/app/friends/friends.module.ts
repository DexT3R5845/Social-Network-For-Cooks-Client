import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendsRoutingModule } from './friends-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { ViewFriendsComponent } from './view-friends/view-friends.component';
import { SharedModule } from '../shared/shared.module';
import { SearchAccountComponent } from './search-account/search-account.component';
import { InvitesComponent } from './invites/invites.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ViewFriendsComponent,
    SearchAccountComponent,
    InvitesComponent,
  ],
  imports: [
    CommonModule,
    FriendsRoutingModule,
    SharedModule
  ]
})
export class FriendsModule { }
