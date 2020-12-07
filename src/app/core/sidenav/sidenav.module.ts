import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { SidenavItemComponent } from './sidenav-item/sidenav-item.component';
import { SidenavCollapseDirective } from './sidenav-collapse.directive';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon'; 
//import {  MatRippleModule } from '@angular/material/ripple';
import { ScrollbarModule } from '../scrollbar/scrollbar.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatIconModule,
  //  MatRippleModule,
    ScrollbarModule,
    MatButtonModule
  ],
  declarations: [
    SidenavComponent,
    SidenavItemComponent,
    SidenavCollapseDirective,
  ],
  exports: [
    SidenavComponent,
    SidenavCollapseDirective
  ]
})
export class SidenavModule { }
