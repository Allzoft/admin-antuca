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
  public router = inject(Router);

  public ref: DynamicDialogRef | undefined;

  items: MenuItem[] = [{ label: 'Cliente' }, { label: 'Pedidos' }];

  home: MenuItem = { icon: 'pi pi-home', routerLink: '/dashboard' };

  customer: Customer = this.customerService.customer()!;

  public user = this.customerService.customer;

  public isLightMode: boolean = true;

  public ngOnInit(): void {
    const themeMode = localStorage.getItem('theme_mode');
    if (!themeMode) return; // Si no hay valor, no hacemos nada.
  
    this.isLightMode = themeMode === 'on';
    const element = document.querySelector('html');
  
    if (element) {
      if (!this.isLightMode) {
        element.classList.add('my-app-dark', 'dark');
      } else {
        element.classList.remove('my-app-dark', 'dark');
      }
    }
  }

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
      styleClass: 'w-11 md:w-6',
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
      acceptButtonStyleClass: ' p-button-success w-7rem',
      rejectLabel: 'No',
      rejectButtonStyleClass: ' p-button-warning w-7rem',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customerService.closeSession();
      },
    });
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (!element !== null) {
      this.isLightMode = !this.isLightMode;
      localStorage.setItem('theme_mode', this.isLightMode ? 'on' : 'off');
      element?.classList.toggle('my-app-dark');
      element?.classList.toggle('dark');
    }
  }
}
