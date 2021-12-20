import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {DishListPageComponent} from "./dish-list-page/dish-list-page.component";
import { DishAddEditComponent } from './dish-add-edit/dish-add-edit.component';
import { DishInfoComponent } from './dish-info/dish-info.component';


const routes: Routes = [{
  path: '', component: LayoutComponent,
  children:[
     {path:'', component: DishListPageComponent},
     {path: 'add', component: DishAddEditComponent},
     {path:':id', component: DishInfoComponent},
    { path: 'edit/:id', component: DishAddEditComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DishRoutingModule { }
