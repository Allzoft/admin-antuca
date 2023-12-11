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
        title: 'Menu Items',
        loadComponent: () =>
          import(
            './dashboard/pages/payments-type/payments-type.component'
          ),
      },
      {
        path: 'users',
        title: 'Users list',
        loadComponent: () =>
          import(
            './dashboard/pages/users/users.component'
          ),
      },
      {
        path: 'states',
        title: 'State',
        loadComponent: () =>
          import(
            './dashboard/pages/states/states.component'
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
