import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomerLogin } from '@interfaces/customer';
import { CustomersService } from '@services/customers.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ToastModule,
    MessagesModule,
    InputTextareaModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule
  ],
  providers: [MessageService],
  templateUrl: './auth.component.html',
})
export default class AuthComponent {
  private customerService = inject(CustomersService);
  private messageService = inject(MessageService);

  public email: string = '';
  public password: string = '';
  public showPassword: boolean = false;
  public remember: boolean = false;

  public accessDenied: boolean = false;
  public accessSuccess: boolean = false;

  constructor(private route: Router) {
    this.email = localStorage.getItem('email') || '';
  }

  public authCustomer() {
    const authCustomer: CustomerLogin = {
      email: this.email,
      password: this.password,
    };

    this.customerService.authLogin(authCustomer, this.remember).subscribe(
      (res) => {

        this.accessSuccess = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Error',
          detail: `¡Hola ${res.customer.name}! Tu accesso fue exitoso`,
        });
        setTimeout(() => {
          this.route.navigateByUrl('/control-panel/daily-summary');
        }, 3000);
      },
      (error) => {
        this.accessDenied = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'La contraseña o correo son incorrectos',
        });
      }
    );
  }
}
