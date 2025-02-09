import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomerLogin } from '@interfaces/customer';
import { CustomersService } from '@services/customers.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '@services/theme.service';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ToastModule,
    MessagesModule,
    TextareaModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
  ],
  providers: [MessageService],
  templateUrl: './auth.component.html',
})
export default class AuthComponent implements OnInit {
  private themeService = inject(ThemeService);
  private customerService = inject(CustomersService);
  private messageService = inject(MessageService);

  public email: string = '';
  public password: string = '';
  public showPassword: boolean = false;
  public remember: boolean = false;

  public accessDenied: boolean = false;
  public accessSuccess: boolean = false;

  public loadingAuth: boolean = false;
  public isDarkMode = this.themeService.isDarkMode;

  constructor(private route: Router) {
    this.email = localStorage.getItem('email') || '';
  }

  public ngOnInit(): void {}

  public authCustomer() {
    const authCustomer: CustomerLogin = {
      email: this.email,
      password: this.password,
    };
    this.loadingAuth = true;

    this.customerService.authLogin(authCustomer, this.remember).subscribe(
      (res) => {
        console.log(res);
        this.loadingAuth = false;
        this.accessSuccess = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `¡Hola ${res.customer.name}! Tu accesso fue exitoso`,
        });
        setTimeout(() => {
          this.route.navigateByUrl('/control-panel/daily-summary');
        }, 3000);
      },
      (error) => {
        this.loadingAuth = false;
        this.accessDenied = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'La contraseña o correo son incorrectos',
        });
      }
    );
  }

  public toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
