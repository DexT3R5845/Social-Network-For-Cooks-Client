import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FriendsRoutingModule } from './friends-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { ViewFriendsComponent } from './view-friends/view-friends.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SearchAccountComponent } from './search-account/search-account.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ViewFriendsComponent,
    SearchAccountComponent,
  ],
  imports: [
    CommonModule,
    FriendsRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class FriendsModule { }
