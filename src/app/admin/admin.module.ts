import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { ModerListPageComponent } from './moder-list-page/moder-list-page.component';
import { ModerListComponent } from './moder-list-page/moder-list/moder-list.component';
import { SearchComponent } from './moder-list-page/search/search.component';
import {SharedModule} from "../shared/shared.module";
import { CreateModerComponent } from './create-moder/create-moder.component';
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    LayoutComponent,
    ModerListPageComponent,
    ModerListComponent,
    SearchComponent,
    CreateModerComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class AdminModule { }
