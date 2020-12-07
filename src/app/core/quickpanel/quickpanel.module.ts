import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuickpanelComponent } from './quickpanel.component';
import { MatButtonModule } from '@angular/material/button'; 
  import {MatListModule} from '@angular/material/list';
    import {MatProgressBarModule } from '@angular/material/progress-bar'; 
      import {MatTabsModule } from '@angular/material/tabs';
import { ScrollbarModule } from '../scrollbar/scrollbar.module';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTabsModule,
    MatListModule,
    ScrollbarModule
  ],
  declarations: [QuickpanelComponent],
  exports: [QuickpanelComponent]
})
export class QuickpanelModule { }
