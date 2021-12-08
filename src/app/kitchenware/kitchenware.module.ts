import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KitchenwareRoutingModule} from "./kitchenware-routing.module";
import { KitchenwareListPageComponent } from './kitchenware-list-page/kitchenware-list-page.component';
import {LayoutComponent} from "./layout/layout.component";
import {SharedModule} from "../shared/shared.module";
import {MatDialogModule} from "@angular/material/dialog";
import { CreateKitchenwareComponent } from './create-kitchenware/create-kitchenware.component';
import { EditKitchenwareComponent } from './edit-kitchenware/edit-kitchenware.component';



@NgModule({
  declarations: [
    LayoutComponent,
    KitchenwareListPageComponent,
    CreateKitchenwareComponent,
    EditKitchenwareComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    KitchenwareRoutingModule,
    MatDialogModule
  ]
})
export class KitchenwareModule { }
