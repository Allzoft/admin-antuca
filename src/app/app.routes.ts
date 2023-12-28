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
        path: 'daily-summary',
        title: 'Resúmen diario',
        loadComponent: () =>
          import(
            './dashboard/pages/daily-summary/daily-summary.component'
          ),
      },
      {
        path: 'orders',
        title: 'Órdenes',
        loadComponent: () =>
          import(
            './dashboard/pages/orders/orders.component'
          ),
      },
      {
        path: 'clients',
        title: 'Clientes',
        loadComponent: () =>
          import(
            './dashboard/pages/clients/clients.component'
          ),
      },
      {
        path: 'menu-items',
        title: 'Menu Items',
        loadComponent: () =>
          import(
            './dashboard/pages/menu-items/menu-items.component'
          ),
      },
      {
        path: 'payments-type',
        title: 'Tipos de pago',
        loadComponent: () =>
          import(
            './dashboard/pages/payments-type/payments-type.component'
          ),
      },
      {
        path: 'users',
        title: 'Lista de usuarios',
        loadComponent: () =>
          import(
            './dashboard/pages/users/users.component'
          ),
      },
      {
        path: 'states',
        title: 'Estados',
        loadComponent: () =>
          import(
            './dashboard/pages/states/states.component'
          ),
      },
      {
        path: '',
        redirectTo: 'daily-summary',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
];
