import { AuthGuard } from '@ghostfolio/client/core/auth.guard';

import { Routes } from '@angular/router';

import { GfOptimizerPageComponent } from './optimizer-page.component';

export const routes: Routes = [
  {
    canActivate: [AuthGuard],
    component: GfOptimizerPageComponent,
    path: '',
    title: 'Tối ưu hóa danh mục'
  }
];
