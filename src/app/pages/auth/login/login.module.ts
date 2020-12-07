import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button'; 
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import {  MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

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
  declarations: [LoginComponent]
})
export class LoginModule { }
