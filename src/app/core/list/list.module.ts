import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule } from '@angular/material/checkbox';
import {MatDialogModule } from '@angular/material/dialog';
import {MatIconModule } from '@angular/material/icon';
import {MatInputModule } from '@angular/material/input';
import {MatMenuModule } from '@angular/material/menu';
import {MatPaginatorModule } from '@angular/material/paginator';
import {MatSortModule } from '@angular/material/sort';
import {MatTableModule } from '@angular/material/table';

import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,

  ],
  declarations: [ListComponent],
  exports: [
    ListComponent,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
  ]
})
export class ListModule {
}
