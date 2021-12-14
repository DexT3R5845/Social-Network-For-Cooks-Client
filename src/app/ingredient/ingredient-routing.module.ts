
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [{
  path: '', component: LayoutComponent,
  children: [
    {path: '', component: ListComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngredientRoutingModule { }
