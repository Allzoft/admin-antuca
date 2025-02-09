import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LayoutService } from '@services/layout.service';

import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CustomersService } from '@services/customers.service';
import { ThemeService } from '@services/theme.service';
@Component({
    selector: 'app-sidemenu',
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
  `
})
export class SidemenuComponent {
  public themeService = inject(ThemeService)
  public layoutService = inject(LayoutService);
  public messageService = inject(MessageService);
  public customersService = inject(CustomersService)
  public router = inject(Router);

  public isDarkMode = this.themeService.isDarkMode

  public toogleMenu() {
    this.layoutService.state.staticMenuDesktopInactive = false;
  }

  public items = this.customersService.access()

 

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
