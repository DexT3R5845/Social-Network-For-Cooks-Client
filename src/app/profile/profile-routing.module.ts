import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DetailsComponent} from './details/details.component';
import {LayoutComponent} from './layout/layout.component';
import {EditDetailsComponent} from "./edit-details/edit-details.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";

const routes: Routes = [{
  path: '', component: LayoutComponent,
  children: [
    {path: '', component: DetailsComponent},
    {path: 'edit-details', component: EditDetailsComponent},
    {path: 'change-password', component: ChangePasswordComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {
}
