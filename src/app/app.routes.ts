import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component'),
  },
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full',
  },
];
