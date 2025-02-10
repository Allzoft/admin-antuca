import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from '../../services/layout.service';
import { InputTextModule } from 'primeng/inputtext';
import { CustomersService } from '@services/customers.service';
import { Customer } from '@interfaces/customer';
import { PipesModule } from '../../pipes/pipes.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router, RouterModule } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { OrderComponent } from '@shared/order/order.component';
import { Order } from '@interfaces/order';
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'app-topbar',
  imports: [
    CommonModule,
    ButtonModule,
    BreadcrumbModule,
    InputTextModule,
    PipesModule,
    RouterModule,
    ConfirmDialogModule,
    InputIconModule,
    SplitButtonModule,
    ToastModule,
    IconFieldModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DialogService,
    DynamicDialogConfig,
  ],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent implements OnInit, OnDestroy {
  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  public layoutService = inject(LayoutService);
  private customerService = inject(CustomersService);
  private confirmationService = inject(ConfirmationService);
  private themeService = inject(ThemeService);
  public router = inject(Router);

  public ref: DynamicDialogRef | undefined;

  items: MenuItem[] = [{ label: 'Cliente' }, { label: 'Pedidos' }];

  home: MenuItem = { icon: 'pi pi-home', routerLink: '/dashboard' };

  customer: Customer = this.customerService.customer()!;

  public user = this.customerService.customer;

  public isDarkMode = this.themeService.isDarkMode;

  public ngOnInit(): void {}

  public ngOnDestroy(): void {
    this.ref?.destroy();
  }

  onMenuButtonClick() {
    console.log(this.layoutService.state.staticMenuDesktopInactive);

    this.layoutService.onMenuToggle();
  }

  onProfileButtonClick() {
    this.router.navigateByUrl('/dashboard/user/' + this.customer.id_customer);
  }

  public createOrder(): void {
    this.ref = this.dialogService.open(OrderComponent, {
      header: `Nueva Orden`,
      draggable: true,
      styleClass: 'w-11/12 md:w-6/12',
      closable: true,
      modal: true,
    });

    this.ref.onClose.subscribe((order: Order) => {
      if (order) {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `Orden para el cliente ${
            order.client!.name
          } creado exitosamente`,
        });
      }
    });
  }

  closeSession() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cerrar sesión?',
      acceptLabel: 'Si',
      acceptButtonStyleClass: ' p-button-success w-28',
      rejectLabel: 'No',
      rejectButtonStyleClass: ' p-button-warning w-28',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customerService.closeSession();
      },
    });
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
