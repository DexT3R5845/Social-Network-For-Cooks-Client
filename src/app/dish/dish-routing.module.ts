import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {DishListPageComponent} from "./dish-list-page/dish-list-page.component";
import { DishAddComponent } from './dish-add/dish-add.component';
import { DishInfoComponent } from './dish-info/dish-info.component';


const routes: Routes = [{
  path: '', component: LayoutComponent,
  children:[
     {path:'', component: DishListPageComponent},
     {path: 'add', component: DishAddComponent},
     {path:':id', component: DishInfoComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DishRoutingModule { }
