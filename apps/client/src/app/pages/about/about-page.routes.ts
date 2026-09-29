import { AuthGuard } from '@ghostfolio/client/core/auth.guard';
import { publicRoutes } from '@ghostfolio/common/routes/routes';

import { Routes } from '@angular/router';

import { AboutPageComponent } from './about-page.component';

export const routes: Routes = [
  {
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./overview/about-overview-page.routes').then((m) => m.routes)
      },
      {
        path: publicRoutes.about.subRoutes.license.path,
        loadChildren: () =>
          import('./license/license-page.routes').then((m) => m.routes)
      }
    ],
    component: AboutPageComponent,
    path: '',
    title: publicRoutes.about.title
  }
];
