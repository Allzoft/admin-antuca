import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../services/layout.service';
import { InputTextModule } from 'primeng/inputtext';
import { CustomersService } from '@services/customers.service';
import { Customer } from '@interfaces/customer';
import { PipesModule } from '../../pipes/pipes.module';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    BreadcrumbModule,
    InputTextModule,
    PipesModule,
  ],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  public layoutService = inject(LayoutService);
  private customerService = inject(CustomersService);

  items: MenuItem[] = [{ label: 'Cliente' }, { label: 'Pedidos' }];

  home: MenuItem = { icon: 'pi pi-home', routerLink: '/dashboard' };

  customer: Customer = this.customerService.customer()!;

  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }
  onProfileButtonClick() {
    this.layoutService.showProfileSidebar();
  }
}
