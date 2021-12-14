import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { ListComponent } from './list/list.component';
import { LayoutComponent } from './layout/layout.component';
import { SharedModule } from '../shared/shared.module';
import { EditComponent } from './edit/edit.component';
import { DeleteComponent } from './delete/delete.component';
import { AddComponent } from './add/add.component';


@NgModule({
  declarations: [
    ListComponent,
    LayoutComponent,
    EditComponent,
    DeleteComponent,
    AddComponent
  ],
  imports: [
    CommonModule,
    StockRoutingModule,
    SharedModule
  ]
})
export class StockModule { }
