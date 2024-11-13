import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LayoutService } from '@services/layout.service';

import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    MenuModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './sidemenu.component.html',
  styles: `
  .dot-card {
    width: 3px;
    height: 3px;
  }
  `,
})
export class SidemenuComponent {
  public layoutService = inject(LayoutService);
  public messageService = inject(MessageService);
  public router = inject(Router);

  public toogleMenu() {
    this.layoutService.state.staticMenuDesktopInactive = false;
  }

  public items: {
    name: string;
    icon: string;
    father: string;
    link: string;
    section: string;
    position: number;
  }[] = [
    {
      name: 'Resúmen diario',
      father: '/control-panel',
      link: '/daily-summary',
      icon: 'sun',
      section: 'root',
      position: 0,
    },
    {
      name: 'Monitor diario',
      father: '/control-panel',
      link: '/daily-monitor',
      icon: 'desktop',
      section: 'root',
      position: 0,
    },
    {
      name: 'Ordenes',
      father: '/orders',
      link: '/orders-list',
      icon: 'list',
      section: 'root',
      position: 0,
    },
    {
      name: 'Clientes',
      father: '/orders',
      link: '/clients-list',
      icon: 'users',
      section: 'root',
      position: 0,
    },
    {
      name: 'Menú',
      father: '/admin',
      link: '/menu-items',
      icon: 'clipboard',
      section: 'root',
      position: 0,
    },
    {
      name: 'Tipos de pago',
      father: '/admin',
      link: '/payments-type',
      icon: 'money-bill',
      section: 'root',
      position: 0,
    },
    {
      name: 'Usuarios',
      father: '/admin',
      link: '/users-list',
      icon: 'users',
      section: 'root',
      position: 0,
    },
    {
      name: 'Estados de Orden',
      father: '/admin',
      link: '/states',
      icon: 'tags',
      section: 'root',
      position: 0,
    },
  ];

  public isOnModule(value: string): boolean {
    const url = this.router.url;

    if (url.includes(value)) return true;

    return false;
  }

  public navigateTo(link: string) {
    if (link === '/admin/payments-type' || link === 'control-panel/reports') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Módulo en construcción',
        icon: 'pi pi-wrench',
        detail: 'Este módulo se habilitará proximamente',
      });
      return;
    }
    this.router.navigateByUrl(link);
    if (this.layoutService.isMobile()) {
      this.layoutService.onMenuToggle();
    }
  }
}
