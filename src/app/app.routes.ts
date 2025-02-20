import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component'),
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component'),
    children: [
      {
        path: 'control-panel',
        children: [
          {
            path: 'daily-summary',
            title: 'Resúmen diario',
            loadComponent: () =>
              import(
                './layout/pages/control-panel/daily-summary/daily-summary.component'
              ),
          },
          {
            path: 'daily-monitor',
            title: 'Monitor diario',
            loadComponent: () =>
              import(
                './layout/pages/control-panel/daily-monitor/daily-monitor.component'
              ),
          },
        ],
      },
      {
        path: 'orders',
        children: [
          {
            path: 'orders-list',
            title: 'Ordenes',
            loadComponent: () =>
              import('./layout/pages/orders/orders-list/orders.component'),
          },
          {
            path: 'clients-list',
            title: 'Clientes',
            loadComponent: () =>
              import('./layout/pages/orders/clients-list/clients.component'),
          },
        ],
      },
      {
        path: 'admin',
        children: [
          {
            path: 'roles',
            title: 'Roles',
            loadComponent: () =>
              import('./layout/pages/admin/roles/roles.component'),
          },
          {
            path: 'menu-items',
            title: 'Menu Items',
            loadComponent: () =>
              import('./layout/pages/admin/menu-items/menu-items.component'),
          },
          {
            path: 'payments-type',
            title: 'Tipos de pago',
            loadComponent: () =>
              import(
                './layout/pages/admin/payments-type/payments-type.component'
              ),
          },
          {
            path: 'users-list',
            title: 'Lista de usuarios',
            loadComponent: () =>
              import('./layout/pages/admin/users/users.component'),
          },
          {
            path: 'user/:id',
            title: 'Usuario',
            loadComponent: () =>
              import('./layout/pages/admin/user/user.component'),
          },
          {
            path: 'user/create',
            title: 'Usuario',
            loadComponent: () =>
              import('./layout/pages/admin/user/user.component'),
          },
          {
            path: 'states',
            title: 'Estados',
            loadComponent: () =>
              import('./layout/pages/admin/states/states.component'),
          },
          {
            path: 'restaurants-list',
            title: 'Lista de restaurantes',
            loadComponent: () =>
              import(
                './layout/pages/admin/restaurants-list/restaurants-list.component'
              ),
          },
        ],
      },

      {
        path: 'settings',
        title: 'Configuración',
        loadComponent: () =>
          import('./layout/pages/settings/settings.component'),
      },
      {
        path: '',
        redirectTo: 'control-panel/daily-summary',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '404',
    title: 'Not found Page',
    loadComponent: () =>
      import('./layout/pages/error404Page/error404Page.component'),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
