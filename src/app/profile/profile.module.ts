import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { DetailsComponent } from './details/details.component';
import { LayoutComponent } from './layout/layout.component';


@NgModule({
  declarations: [
    DetailsComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
