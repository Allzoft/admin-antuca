import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Customer } from '@interfaces/customer';
import { CustomersService } from '@services/customers.service';
import { TitleComponent } from '@shared/title/title.component';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PipesModule } from '../../../pipes/pipes.module';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    CardModule,
    TableModule,
    PipesModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    RouterModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './users.component.html',
})
export default class UsersComponent {
  private customersService = inject(CustomersService);
  public customers = this.customersService.customers;
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  public router = inject(Router);

  constructor() {
    if (this.customers().length === 0) {
      this.customersService.getUsers();
    }
  }

  removeUser(customer: Customer) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar este usuario?',
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-rounded p-button-success w-7rem',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-warning w-7rem',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customersService
          .deleteUser(customer.id_customer)
          .subscribe((_) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminación exitosa',
              detail: `Usuario eliminado exitosamente`,
            });
          });
      },
    });
  }

  public editUser(customer: Customer): void {
    this.router.navigateByUrl(`dashboard/user/${customer.id_customer}`);
  }

  public createUser(): void {
    this.router.navigateByUrl(`dashboard/user/create`);
  }
}
