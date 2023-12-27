import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Customer } from '@interfaces/customer';
import { CustomersService } from '@services/customers.service';
import { TitleComponent } from '@shared/title/title.component';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PipesModule } from '../../../pipes/pipes.module';
import { ButtonModule } from 'primeng/button';

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
  ],
  templateUrl: './users.component.html',
})
export default class UsersComponent {
  private customersService = inject(CustomersService);
  public customers = this.customersService.customers
  ;

  constructor() {
    if(this.customers().length === 0){
      this.customersService.getUsers()
    }
  }
}
