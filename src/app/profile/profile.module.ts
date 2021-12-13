import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProfileRoutingModule} from './profile-routing.module';
import {DetailsComponent} from './details/details.component';
import {LayoutComponent} from './layout/layout.component';
import {CookieStorageService} from '../_helpers';
import {SharedModule} from '../shared/shared.module';
import {EditDetailsComponent} from './edit-details/edit-details.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {FormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {DialogViewComponent} from './dialog-view/dialog-view.component';

@NgModule({
  declarations: [
    DetailsComponent,
    LayoutComponent,
    EditDetailsComponent,
    ChangePasswordComponent,
    DialogViewComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    FormsModule,
    MatDialogModule
  ],
  providers: [
    CookieStorageService
  ],
})
export class ProfileModule {
}
