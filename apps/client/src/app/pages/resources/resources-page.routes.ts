import { AuthGuard } from '@ghostfolio/client/core/auth.guard';
import { publicRoutes } from '@ghostfolio/common/routes/routes';

import { Routes } from '@angular/router';

import { ResourcesPageComponent } from './resources-page.component';

export const routes: Routes = [
  {
    canActivate: [AuthGuard],
    component: ResourcesPageComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./overview/resources-overview.routes').then((m) => m.routes)
      }
    ],
    path: '',
    title: publicRoutes.resources.title
  }
];
