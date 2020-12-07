import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreadcrumbsModule } from '../../core/breadcrumbs/breadcrumbs.module';
import { PageHeaderModule } from '../../core/page-header/page-header.module';
import { MenuComponent } from '../../core/menu/menu.component';
import { MenuModule } from '../../core/menu/menu.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule} from '@angular/material/button';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule} from '@angular/material/input';
import { MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';

import { MatRadioModule} from '@angular/material/radio';
import { MatSelectModule} from '@angular/material/select';
import { MatSliderModule} from '@angular/material/slider';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatTabsModule} from '@angular/material/tabs';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatTableModule} from '@angular/material/table';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '../../core/utils/utils.module';

import { ScrollbarModule } from '../../core/scrollbar/scrollbar.module';
import { CdkTableModule } from '@angular/cdk/table';

import { BalcaoRoutingModule } from './balcao.routing';
import { StoreFrontBudgetComponent } from './home/home.component';
import { ClientSearchComponent } from './client-search/client-search.component';
import { ClientRegisterComponent } from './client-register/client-register.component';
import { InputFieldSelectComponent } from 'app/shared/inputs/input-field-select/input-field-select.component';
import { ConfirmacaoComponent } from 'app/shared/mensagem/confirmacao.component';
import { AnimalRegisterComponent } from './animal-register/animal-register.component';
import { ScrollGridComponent } from 'app/shared/components/scroll-grid/scroll-grid.component';
import { ProviderRegisterComponent } from './provider-register/provider-register.component';
import { ProviderSearchComponent } from './provider-search/provider-search.component';
import {ScheduleRegisterComponent} from './schedule/schedule-register.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { AttendanceSearchComponent } from './attendance/attendance-search.component';

@NgModule({
  imports: [
    CommonModule,
    BalcaoRoutingModule,
    MenuModule,
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
    NgxMaskModule.forRoot(),
    MatAutocompleteModule
  ],
  declarations: [
    StoreFrontBudgetComponent,
    MenuComponent,
    ClientSearchComponent,
    ClientRegisterComponent,
    MatSpinner,
    InputFieldSelectComponent,
    ConfirmacaoComponent,
    AnimalRegisterComponent,
    ScrollGridComponent,
    ProviderRegisterComponent,
    ProviderSearchComponent,
    ScheduleRegisterComponent,
    AttendanceComponent, AttendanceSearchComponent
   ],
  exports: [
    CommonModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    //{provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  entryComponents: [
    ConfirmacaoComponent
],
schemas: [
  CUSTOM_ELEMENTS_SCHEMA,
]
})
export class BalcaoModule { }
