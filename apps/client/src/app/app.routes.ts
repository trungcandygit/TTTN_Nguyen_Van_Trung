import { internalRoutes, publicRoutes } from '@ghostfolio/common/routes/routes';

import { Routes } from '@angular/router';

import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: publicRoutes.about.path,
    loadChildren: () =>
      import('./pages/about/about-page.routes').then((m) => m.routes)
  },
  {
    path: internalRoutes.account.path,
    loadChildren: () =>
      import('./pages/user-account/user-account-page.routes').then(
        (m) => m.routes
      )
  },
  {
    path: internalRoutes.accounts.path,
    loadChildren: () =>
      import('./pages/accounts/accounts-page.routes').then((m) => m.routes)
  },
  {
    path: internalRoutes.adminControl.path,
    loadChildren: () =>
      import('./pages/admin/admin-page.routes').then((m) => m.routes)
  },
  {
    path: internalRoutes.auth.path,
    loadChildren: () =>
      import('./pages/auth/auth-page.routes').then((m) => m.routes),
    title: internalRoutes.auth.title
  },
  {
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/demo/demo-page.component').then(
        (c) => c.GfDemoPageComponent
      ),
    path: publicRoutes.demo.path
  },
  {
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/features/features-page.component').then(
        (c) => c.GfFeaturesPageComponent
      ),
    path: publicRoutes.features.path,
    title: publicRoutes.features.title
  },
  {
    path: internalRoutes.home.path,
    loadChildren: () =>
      import('./pages/home/home-page.routes').then((m) => m.routes)
  },
  {
    path: publicRoutes.markets.path,
    loadChildren: () =>
      import('./pages/markets/markets-page.routes').then((m) => m.routes)
  },
  {
    path: internalRoutes.portfolio.path,
    loadChildren: () =>
      import('./pages/portfolio/portfolio-page.routes').then((m) => m.routes)
  },
  {
    path: publicRoutes.public.path,
    loadChildren: () =>
      import('./pages/public/public-page.routes').then((m) => m.routes)
  },
  {
    path: publicRoutes.register.path,
    loadChildren: () =>
      import('./pages/register/register-page.routes').then((m) => m.routes)
  },
  {
    path: publicRoutes.resources.path,
    loadChildren: () =>
      import('./pages/resources/resources-page.routes').then((m) => m.routes)
  },
  {
    path: publicRoutes.start.path,
    loadChildren: () =>
      import('./pages/landing/landing-page.routes').then((m) => m.routes)
  },
  {
    loadComponent: () =>
      import('./pages/webauthn/webauthn-page.component').then(
        (c) => c.GfWebauthnPageComponent
      ),
    path: internalRoutes.webauthn.path
  },
  {
    path: internalRoutes.zen.path,
    loadChildren: () =>
      import('./pages/zen/zen-page.routes').then((m) => m.routes)
  },
  {
    // the root goes to the home page (the AuthGuard sends visitors who are
    // not logged in to the landing page)
    path: '',
    pathMatch: 'full',
    redirectTo: internalRoutes.home.path
  },
  {
    // wildcard, if requested url doesn't match any paths for routes defined
    // earlier
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found-page.component').then(
        (c) => c.GfNotFoundPageComponent
      ),
    title: 'Không tìm thấy trang'
  }
];
