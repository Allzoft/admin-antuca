import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LayoutService } from '@services/layout.service';

import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, MenuModule, ToastModule],
  providers: [MessageService],
  templateUrl: './sidemenu.component.html',
  styles: `

  `,
})
export class SidemenuComponent {
  public layoutService = inject(LayoutService);
  public messageService = inject(MessageService);
  public router = inject(Router);

  public toogleMenu() {
    this.layoutService.onMenuToggle();
  }

  public items: MenuItem[] = [
    {
      label: 'Panel de control',
      items: [
        {
          label: 'Informes',
          icon: 'pi pi-chart-bar',
          command: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'En construcción',
              detail: 'Página de informes en construcción',
              icon: 'pi pi-lock'
            });
          },
        },
      ],
    },
    {
      label: 'Clientes',
      items: [
        {
          label: 'Órdenes',
          icon: 'pi pi-megaphone',
          routerLink: ['/dashboard/orders'],
          command: () => {
            if(this.layoutService.isMobile()){
              this.layoutService.onMenuToggle()
            }
          },
        },
        {
          label: 'Menú',
          icon: 'pi pi-book',
          routerLink: ['/dashboard/menu-items'],
          command: () => {
            if(this.layoutService.isMobile()){
              this.layoutService.onMenuToggle()
            }
          },
        },
        {
          label: 'Mis clientes',
          icon: 'pi pi-users',
          routerLink: ['/dashboard/clients'],
          command: () => {
            if(this.layoutService.isMobile()){
              this.layoutService.onMenuToggle()
            }
          },
        },
      ],
    },
    {
      label: 'Administración',
      items: [
        {
          label: 'Usuarios',
          icon: 'pi pi-users',
          routerLink: ['/dashboard/users'],
          command: () => {
            if(this.layoutService.isMobile()){
              this.layoutService.onMenuToggle()
            }
          },
        },
        {
          label: 'Estados',
          icon: 'pi pi-tags',
          routerLink: ['/dashboard/states'],
          command: () => {
            if(this.layoutService.isMobile()){
              this.layoutService.onMenuToggle()
            }
          },
        },
        {
          label: 'Modos de pago',
          icon: 'pi pi-money-bill',
          command: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'En construcción',
              detail: 'Página de Modos de pago en construcción',
              icon: 'pi pi-lock'
            });
          },
        },
      ],
    },
  ];
}
