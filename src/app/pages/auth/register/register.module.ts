import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button'; 
  import {MatCheckboxModule } from '@angular/material/checkbox'; 
    import {MatInputModule } from '@angular/material/input';

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
  declarations: [RegisterComponent]
})
export class RegisterModule { }
