import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxComponent } from './inbox.component';
import { InboxComposeComponent } from './inbox-compose/inbox-compose.component';
import { FormsModule } from '@angular/forms';
import {MatButtonModule } from '@angular/material/button'; 
import {MatCheckboxModule } from '@angular/material/checkbox'; 
import {MatDialogModule } from '@angular/material/dialog'; 
import {MatIconModule } from '@angular/material/icon'; 
import {MatInputModule } from '@angular/material/input'; 
import {MatListModule } from '@angular/material/list'; 
import {MatMenuModule } from '@angular/material/menu';
//import {MatRippleModule } from '@angular/material/Ripple'; 
import {MatSnackBarModule } from '@angular/material/snack-bar'; 
import {MatTooltipModule } from '@angular/material/tooltip';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollbarModule } from '../../core/scrollbar/scrollbar.module';
import { InboxRoutingModule } from './inbox.routing';

@NgModule({
  imports: [
    CommonModule,
    InboxRoutingModule,
    FlexLayoutModule,
    ScrollbarModule,
    FormsModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatCheckboxModule,
    //MatRippleModule,
    MatDialogModule,
    MatInputModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  entryComponents: [InboxComposeComponent],
  declarations: [InboxComponent, InboxComposeComponent]
})
export class InboxModule { }
