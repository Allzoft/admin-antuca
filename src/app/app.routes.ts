import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component'),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    children: [
      {
        path: 'orders',
        title: 'Orders',
        loadComponent: () =>
          import(
            './dashboard/pages/orders/orders.component'
          ),
      },
      {
        path: 'clients',
        title: 'Clients',
        loadComponent: () =>
          import(
            './dashboard/pages/clients/clients.component'
          ),
      },
    ]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
];
