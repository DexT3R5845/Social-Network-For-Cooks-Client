import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [{
  path: '', component: LayoutComponent,
  children:[
    {path:'', component: DetailsComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
