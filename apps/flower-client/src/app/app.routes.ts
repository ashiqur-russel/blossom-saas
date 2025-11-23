import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'weeks/new',
    loadComponent: () =>
      import('./components/flower-week-form/flower-week-form.component').then(
        (m) => m.FlowerWeekFormComponent,
      ),
  },
  {
    path: 'weeks/:id/edit',
    loadComponent: () =>
      import('./components/flower-week-form/flower-week-form.component').then(
        (m) => m.FlowerWeekFormComponent,
      ),
  },
];
