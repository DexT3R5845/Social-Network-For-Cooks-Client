import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { DetailsComponent } from './details/details.component';
import { LayoutComponent } from './layout/layout.component';
import { CookieStorageService } from '../_helpers';


@NgModule({
  declarations: [
    DetailsComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ],
  providers:[
    CookieStorageService
  ]
})
export class ProfileModule { }
