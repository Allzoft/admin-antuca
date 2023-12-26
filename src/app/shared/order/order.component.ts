import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order } from '@interfaces/order';
import { ClientsService } from '@services/clients.service';
import { CustomersService } from '@services/customers.service';
import { OrdersService } from '@services/orders.service';
import { StatesService } from '@services/states.service';
import { ButtonModule } from 'primeng/button';
import { DropdownFilterEvent, DropdownModule } from 'primeng/dropdown';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextareaModule,
    InputTextModule,
    InputNumberModule,
    InputSwitchModule,
    ButtonModule,
  ],
  templateUrl: './order.component.html',
})
export class OrderComponent {
  public dialogService = inject(DialogService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public ordersService = inject(OrdersService);
  public clientsService = inject(ClientsService);
  public customerService = inject(CustomersService);
  public statesService = inject(StatesService);

  public clients = this.clientsService.clients;
  public filteredClients = [...this.clientsService.clients()]
  public customers = this.customerService.customer;
  public states = this.statesService
    .states()
    .filter((s) => s.type === 'Órdenes');

  public order: Order = {
    id_order: 0,
    customerIdCustomer: 0,
    clientIdClient: 0,
    date: new Date(),
    stateIdState: 0,
    total_amount: 0,
    paymentTypeIdPaymentType: 0,
    service_mode: 'En sala',
    notes: '',
  };

  public inputDirt = {
    client: false,
    customer: false,
    date: false,
    state: false,
    total_amount: false,
    paymentTypeIdPaymentType: false,
    service_mode: false,
    notes: false,
  };

  public serviceModes: {
    isSelect: boolean;
    label: 'Para llevar' | 'En sala';
  }[] = [
    { isSelect: true, label: 'En sala' },
    { isSelect: false, label: 'Para llevar' },
  ];

  constructor() {
    if (this.config.data) {
      this.order = this.config.data.order;
      this.serviceModes.forEach((s) => {
        s.label === this.order.service_mode
          ? (s.isSelect = true)
          : (s.isSelect = false);
      });
    }
  }

  public selectServiceMode(i: number) {
    this.serviceModes.forEach((s) => (s.isSelect = false));
    this.serviceModes[i].isSelect = true;
  }

}
