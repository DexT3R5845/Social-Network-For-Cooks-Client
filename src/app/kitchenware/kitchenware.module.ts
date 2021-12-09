import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KitchenwareRoutingModule} from "./kitchenware-routing.module";
import { KitchenwareListPageComponent } from './kitchenware-list-page/kitchenware-list-page.component';
import {LayoutComponent} from "./layout/layout.component";
import {SharedModule} from "../shared/shared.module";
import {MatDialogModule} from "@angular/material/dialog";
import { CreateKitchenwareComponent } from './create-kitchenware/create-kitchenware.component';
import { EditKitchenwareComponent } from './edit-kitchenware/edit-kitchenware.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";



@NgModule({
  declarations: [
    LayoutComponent,
    KitchenwareListPageComponent,
    CreateKitchenwareComponent,
    EditKitchenwareComponent
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    CommonModule,
    SharedModule,
    KitchenwareRoutingModule,
    MatDialogModule
  ]
})
export class KitchenwareModule { }
