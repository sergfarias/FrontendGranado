import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule } from '@angular/material/button'; 
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import {  MatInputModule } from '@angular/material/input';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  declarations: [ForgotPasswordComponent]
})
export class ForgotPasswordModule { }
