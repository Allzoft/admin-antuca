import { CommonModule } from '@angular/common';
import { Component, Signal, inject } from '@angular/core';
import { Client } from '@interfaces/client';
import { Order } from '@interfaces/order';
import { OrdersService } from '@services/orders.service';
import { ClientComponent } from '@shared/client/client.component';
import { TitleComponent } from '@shared/title/title.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    CardModule,
    TitleComponent,
    TableModule,
    ButtonModule,
    TagModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DialogService,
    DynamicDialogConfig,
  ],
  templateUrl: './orders.component.html',
})
export default class OrdersComponent {
  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);
  public ordersService = inject(OrdersService);

  public orders: Signal<Order[]> = this.ordersService.orders;

  public ref: DynamicDialogRef | undefined;

  public refreshData(): void {
    this.ordersService.getOrders();
  }

  public showClient(client: Client): void {
    this.ref = this.dialogService.open(ClientComponent, {
      header: 'Client: ' + client.name + ' ' + client.lastname,
      draggable: true,
      styleClass: 'w-11 md:w-5',
      data: {
        client: client,
        disabled: true,
      },
    });
  }
}
