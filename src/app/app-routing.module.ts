import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { authRoutes } from './pages/auth/auth.routing';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: 'app/pages/balcao/balcao.module#BalcaoModule'
      }
    ]
  },
  {
    path: 'auth',
    children: [
      ...authRoutes
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
