import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { StoreFrontBudgetComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: StoreFrontBudgetComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    NgxMaskModule.forRoot()
  ],
  exports: [RouterModule],
})

export class BalcaoRoutingModule { }
