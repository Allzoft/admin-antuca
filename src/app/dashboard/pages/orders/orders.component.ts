import { CommonModule } from '@angular/common';
import { Component, Signal, inject } from '@angular/core';
import { Order } from '@interfaces/order';
import { OrdersService } from '@services/orders.service';
import { TitleComponent } from '@shared/title/title.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
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
  templateUrl: './orders.component.html',
})
export default class OrdersComponent {
  public ordersService = inject(OrdersService);
  public orders: Signal<Order[]> = this.ordersService.orders;

  public refreshData(): void {
    this.ordersService.getOrders();
  }
}
