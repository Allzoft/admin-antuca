import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LayoutService } from '../../services/layout.service';
import { InputTextModule } from 'primeng/inputtext';
import { CustomersService } from '@services/customers.service';
import { Customer } from '@interfaces/customer';
import { PipesModule } from '../../pipes/pipes.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    BreadcrumbModule,
    InputTextModule,
    PipesModule,
    RouterModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  public layoutService = inject(LayoutService);
  private customerService = inject(CustomersService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router)

  items: MenuItem[] = [{ label: 'Cliente' }, { label: 'Pedidos' }];

  home: MenuItem = { icon: 'pi pi-home', routerLink: '/dashboard' };

  customer: Customer = this.customerService.customer()!;

  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }

  onProfileButtonClick() {
   this.router.navigateByUrl('/dashboard/user/' + this.customer.id_customer)
  }

  closeSession() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cerrar sesión?',
      acceptLabel: 'Si',
      acceptButtonStyleClass:
        'p-button-rounded p-button-success w-7rem',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-warning w-7rem',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customerService.closeSession();
      },
    });;
  }
}
