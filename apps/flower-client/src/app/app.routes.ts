import { Routes } from '@angular/router';

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
      import('./shared/layouts/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent,
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard').then(
            (m) => m.DashboardContainerComponent,
          ),
      },
      {
        path: 'weeks/new',
        loadComponent: () =>
          import('./features/weeks').then(
            (m) => m.WeekSalesEditorContainerComponent,
          ),
      },
      {
        path: 'weeks/:id/edit',
        loadComponent: () =>
          import('./features/weeks').then(
            (m) => m.WeekSalesEditorContainerComponent,
          ),
      },
      {
        path: 'withdrawals',
        loadComponent: () =>
          import('./features/withdrawals').then(
            (m) => m.WithdrawalComponent,
          ),
      },
    ],
  },
];
