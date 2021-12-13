import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../admin/layout/layout.component';
import {ModerListPageComponent} from "./moder-list-page/moder-list-page.component";

const routes: Routes = [{
  path:'', component:LayoutComponent,
  children: [
    {path: '', component: ModerListPageComponent}
  ]


}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
