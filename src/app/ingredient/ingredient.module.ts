import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngredientRoutingModule } from './ingredient-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../shared/shared.module';
import { AddEditComponent } from './add-edit/add-edit.component';
import { DeleteComponent } from './delete/delete.component';


@NgModule({
  declarations: [
    LayoutComponent,
    ListComponent,
    AddEditComponent,
    DeleteComponent
  ],
  imports: [
    CommonModule,
    IngredientRoutingModule,
    SharedModule,
  ]
})
export class IngredientModule { }
