import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Customer } from '@interfaces/customer';
import { CustomersService } from '@services/customers.service';
import { UploadService } from '@services/upload.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PipesModule } from '../../../pipes/pipes.module';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-user',
    imports: [
        CommonModule,
        RouterModule,
        CardModule,
        ProgressSpinnerModule,
        ButtonModule,
        FileUploadModule,
        InputTextModule,
        FormsModule,
        PipesModule,
        ToastModule,
        ConfirmDialogModule,
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './user.component.html'
})
export default class UserComponent implements OnInit {
  private uploadService = inject(UploadService);
  private customerService = inject(CustomersService);
  public router = inject(Router);
  public route = inject(ActivatedRoute);
  public idUser: string | null | undefined;
  public loading: boolean = false;

  public password: string = '';

  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  public customer: Customer = {
    id_customer: 0,
    code_country: '+591',
    email: '',
    id: '',
    roleIdRole: 1,
    restaurantIdRestaurant: 1,
    name: '',
    lastname: '',
    phone: '',
    photo: '',
    token: '123',
  };

  public inputDirt = {
    email: false,
    id: false,
    name: false,
    phone: false,
    password: false,
  };

  ngOnInit(): void {
    this.idUser = this.route.snapshot.paramMap.get('id');
    console.log(this.idUser);

    if (this.idUser && !isNaN(+this.idUser)) {
      this.customerService.getOneUser(+this.idUser).subscribe((res) => {
        this.customer = res;
      });
    }
  }

  public onUpload(event: any) {
    console.log(event);

    if (event.files.length > 0) {
      const file = event.files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.uploadService.uploadfile(formData).subscribe((res) => {
        console.log(res);
        this.customer.photo = res['filename'];
      });
    }
  }

  public async saveUser(): Promise<void> {
    if (!(await this.passCustomerForm())) return;
    this.loading = true;
    console.log('paso');

    let customer: Partial<Customer>;

    if (this.password) {
      customer = {
        name: this.customer.name,
        lastname: this.customer.lastname,
        code_country: this.customer.code_country,
        email: this.customer.email,
        id: this.customer.id,
        phone: this.customer.phone,
        photo: this.customer.photo,
        password: this.password,
        token: this.customer.token,
      };
    } else {
      customer = {
        name: this.customer.name,
        lastname: this.customer.lastname,
        code_country: this.customer.code_country,
        email: this.customer.email,
        id: this.customer.id,
        phone: this.customer.phone,
        photo: this.customer.photo,
        token: this.customer.token,
      };
    }

    if (this.customer.id_customer === 0) {
      this.customerService.postCustomer(customer).subscribe((_) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: 'Usario creado con exito',
        });
        setTimeout(() => {
          this.router.navigateByUrl('dashboard/users');
        }, 3000);
      });
    } else {
      this.customerService
        .updateUser(+this.customer.id_customer, customer)
        .subscribe((_) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exito!',
            detail: 'Usario actualizado con exito',
          });
          setTimeout(() => {
            this.router.navigateByUrl('dashboard/users');
          }, 3000);
        });
    }
  }

  public passCustomerForm(): Promise<boolean> {
    if (!this.customer.name) {
      this.inputDirt.name = true;
      return Promise.resolve(false);
    }
    if (!this.customer.id) {
      this.inputDirt.id = true;
      return Promise.resolve(false);
    }
    if (!this.customer.phone) {
      this.inputDirt.phone = true;
      return Promise.resolve(false);
    }
    if (!this.customer.email) {
      this.inputDirt.email = true;
      return Promise.resolve(false);
    }
    if (this.password.length < 4) {
      this.inputDirt.password = true;
      return Promise.resolve(false);
    }

    this.inputDirt.password = false;
    this.inputDirt.email = false;
    this.inputDirt.phone = false;
    this.inputDirt.id = false;
    this.inputDirt.name = false;

    return Promise.resolve(true);
  }
}
