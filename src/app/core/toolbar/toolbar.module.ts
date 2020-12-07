import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarUserButtonComponent } from './toolbar-user-button/toolbar-user-button.component';
import { ToolbarNotificationsComponent } from './toolbar-notifications/toolbar-notifications.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { ToolbarAlphaComponent } from './toolbar-alpha/toolbar-alpha.component';
import { ToolbarBetaComponent } from './toolbar-beta/toolbar-beta.component';
import { SearchComponent } from './search/search.component';
import { ToolbarGammaComponent } from './toolbar-gamma/toolbar-gamma.component';
import { ToolbarNavigationComponent } from './toolbar-navigation/toolbar-navigation.component';
import { ToolbarNavigationItemComponent } from './toolbar-navigation/toolbar-navigation-item/toolbar-navigation-item.component';
import { ToolbarNavigationDropdownItemComponent } from './toolbar-navigation/toolbar-navigation-item/toolbar-navigation-dropdown-item/toolbar-navigation-dropdown-item.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollbarModule } from '../scrollbar/scrollbar.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UtilsModule } from '../utils/utils.module';
import { MatDialogModule } from '@angular/material/dialog';
import { BalcaoRoutingModule } from '../../pages/balcao/balcao.routing';
import { BreadcrumbsModule } from '../breadcrumbs/breadcrumbs.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { PageHeaderModule } from '../page-header/page-header.module';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

/*import { MatRippleModule } from '@angular/material/ripple';*/

@NgModule({
  imports: [
    CommonModule,
    BalcaoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbsModule,
    UtilsModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatTabsModule,
    PageHeaderModule,
    ScrollbarModule,
    CdkTableModule,
    MatPaginatorModule,
    MatTableModule,
    RouterModule,
    MatMenuModule,
    MatDialogModule
    /*MatRippleModule*/
  ],
  declarations: [
    ToolbarUserButtonComponent,
    ToolbarNotificationsComponent,
    SearchBarComponent,
    ToolbarAlphaComponent,
    ToolbarBetaComponent,
    SearchComponent,
    ToolbarGammaComponent,
    ToolbarNavigationComponent,
    ToolbarNavigationItemComponent,
    ToolbarNavigationDropdownItemComponent
  ],
  exports: [
    ToolbarUserButtonComponent,
    ToolbarNotificationsComponent,
    SearchBarComponent,
    ToolbarAlphaComponent,
    ToolbarBetaComponent,
    SearchComponent,
    ToolbarGammaComponent,
    ToolbarNavigationComponent,
    ToolbarNavigationItemComponent,
    ToolbarNavigationDropdownItemComponent
  ]
})
export class ToolbarModule { }
