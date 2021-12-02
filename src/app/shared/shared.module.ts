import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { AngularMaterialModule } from '../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    AlertComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    AlertComponent,
    AngularMaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CommonModule
  ]
})
export class SharedModule { }
