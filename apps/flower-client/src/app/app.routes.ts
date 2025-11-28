import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/landing/components/landing-page/landing-page.component').then(
            (m) => m.LandingPageComponent,
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent,
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/components/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/components/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent,
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.container').then(
            (m) => m.DashboardContainerComponent,
          ),
      },
      {
        path: 'weeks/new',
        loadComponent: () =>
          import('./features/weeks/week-sales-editor.container').then(
            (m) => m.WeekSalesEditorContainerComponent,
          ),
      },
      {
        path: 'weeks/:id/edit',
        loadComponent: () =>
          import('./features/weeks/week-sales-editor.container').then(
            (m) => m.WeekSalesEditorContainerComponent,
          ),
      },
      {
        path: 'withdrawals',
        loadComponent: () =>
          import('./features/withdrawals/withdrawal.component').then(
            (m) => m.WithdrawalComponent,
          ),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/analytics/analytics.container').then(
            (m) => m.AnalyticsContainerComponent,
          ),
      },
    ],
  },
];
