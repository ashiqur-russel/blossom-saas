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
          import('./features/dashboard/components/dashboard-container/dashboard-container.component').then(
            (m) => m.DashboardContainerComponent,
          ),
      },
      {
        path: 'weeks/new',
        loadComponent: () =>
          import('./features/weeks/components/week-sales-editor/week-sales-editor-container.component').then(
            (m) => m.WeekSalesEditorContainerComponent,
          ),
      },
      {
        path: 'weeks/:id/edit',
        loadComponent: () =>
          import('./features/weeks/components/week-sales-editor/week-sales-editor-container.component').then(
            (m) => m.WeekSalesEditorContainerComponent,
          ),
      },
      {
        path: 'withdrawals',
        loadComponent: () =>
          import('./features/withdrawals/components/withdrawal/withdrawal.component').then(
            (m) => m.WithdrawalComponent,
          ),
      },
    ],
  },
];
