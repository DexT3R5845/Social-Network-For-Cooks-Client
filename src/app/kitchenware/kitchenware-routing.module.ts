import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {KitchenwareListPageComponent} from "./kitchenware-list-page/kitchenware-list-page.component";

const routes: Routes = [{
  path: '', component: LayoutComponent,
  children:[
     {path:'', component: KitchenwareListPageComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KitchenwareRoutingModule { }
