import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
/*import { MatRippleModule } from '@angular/material/ripple';*/
import { MatSidenavModule } from '@angular/material/sidenav';
import { SettingsModule } from 'app/core/settings/settings.module';
import { SidenavModule } from '../sidenav/sidenav.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { QuickpanelModule } from '../quickpanel/quickpanel.module';
import { RouterModule } from '@angular/router';
import { ScrollbarService } from '../scrollbar/scrollbar.service';
import { PreloaderModule } from '../preloader/preloader.module';
import { PreloaderComponent } from '../preloader/preloader.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PreloaderModule,
    FlexLayoutModule,
    MatSidenavModule,
    SidenavModule,
    SettingsModule,
    ToolbarModule,
    QuickpanelModule,
    MatIconModule,
    /*MatRippleModule,*/
    MatButtonModule
  ],
  declarations: [
    LayoutComponent,
    PreloaderComponent
  ],
  exports: [LayoutComponent],
  providers: [ScrollbarService]
})
export class LayoutModule { }
