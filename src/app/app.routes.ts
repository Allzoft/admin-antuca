import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component'),
  },
  {
    path: '',
    loadComponent: () => import('./dashboard/layout.component'),
    children: [
      {
        path: 'control-panel/daily-summary',
        title: 'Resúmen diario',
        loadComponent: () =>
          import(
            './dashboard/pages/daily-summary/daily-summary.component'
          ),
      },
      {
        path: 'orders/orders-list',
        title: 'Órdenes',
        loadComponent: () =>
          import(
            './dashboard/pages/orders/orders.component'
          ),
      },
      {
        path: 'orders/clients-list',
        title: 'Clientes',
        loadComponent: () =>
          import(
            './dashboard/pages/clients/clients.component'
          ),
      },
      {
        path: 'admin/menu-items',
        title: 'Menu Items',
        loadComponent: () =>
          import(
            './dashboard/pages/menu-items/menu-items.component'
          ),
      },
      {
        path: 'admin/payments-type',
        title: 'Tipos de pago',
        loadComponent: () =>
          import(
            './dashboard/pages/payments-type/payments-type.component'
          ),
      },
      {
        path: 'admin/users-list',
        title: 'Lista de usuarios',
        loadComponent: () =>
          import(
            './dashboard/pages/users/users.component'
          ),
      },
      {
        path: 'user/:id',
        title: 'Usuario',
        loadComponent: () =>
          import(
            './dashboard/pages/user/user.component'
          ),
      },
      {
        path: 'user/create',
        title: 'Usuario',
        loadComponent: () =>
          import(
            './dashboard/pages/user/user.component'
          ),
      },
      {
        path: 'admin/states',
        title: 'Estados',
        loadComponent: () =>
          import(
            './dashboard/pages/states/states.component'
          ),
      },
      {
        path: '',
        redirectTo: 'control-panel/daily-summary',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];
