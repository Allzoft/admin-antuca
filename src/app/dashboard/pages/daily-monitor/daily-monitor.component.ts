import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order, ServiceMode } from '@interfaces/order';
import { LayoutService } from '@services/layout.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { SidebarModule } from 'primeng/sidebar';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { StatesService } from '@services/states.service';
import { State } from '@interfaces/state';
import { InputSwitchModule } from 'primeng/inputswitch';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OrderComponent } from '@shared/order/order.component';
import { Client } from '@interfaces/client';
import { ClientComponent } from '@shared/client/client.component';
import { CustomersService } from '@services/customers.service';
import { OrdersService } from '@services/orders.service';
import { DailyMonitorSocket } from '@services/sockets/dailyMonitor.socket';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-daily-monitor',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    SidebarModule,
    MultiSelectModule,
    MessagesModule,
    TagModule,
    BadgeModule,
    InputSwitchModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DialogService,
    DynamicDialogConfig,
    DailyMonitorSocket,
  ],
  styles: `
    .w-0 {
      width: 0%;
    }
  `,
  templateUrl: './daily-monitor.component.html',
})
export default class DailyMonitorComponent implements OnInit {
  private messageService = inject(MessageService);
  public configRef = inject(DynamicDialogConfig);
  public usersService = inject(CustomersService);
  public dialogService = inject(DialogService);
  public layoutService = inject(LayoutService);
  public statesService = inject(StatesService);
  public ordersService = inject(OrdersService);

  public dailyMonitorSocket = inject(DailyMonitorSocket);

  public currentTime: string = '';

  public loading: boolean = false;

  public showFilters = false;

  public states = this.statesService.states;
  public filterStatesSelect: State[] = [];

  public filterRoleSelect: string = 'Cocina';
  public filterOptionsRole: string[] = ['Cocina'];

  public ref: DynamicDialogRef | undefined;

  public serviceModes: ServiceMode[] = Object.values(ServiceMode);
  public filterServiceModeSelect: ServiceMode[] = [];

  public messages: Message[] = [
    {
      severity: 'success',
      detail: 'Hola! ' + this.usersService.customer()!.name + ', a trabajar.',
      icon: 'pi pi-check',
    },
  ];

  public orders: Order[] = [];

  public messagesToSend: Message[] = [];

  private newOrderSubscription: Subscription;
  private updateOrderSubscription: Subscription;
  private deleteOrderSubscription: Subscription;

  ngOnInit(): void {
    this.updateTime(); // Llamamos a la función inicialmente
    setInterval(() => this.updateTime(), 1000); // Actualizamos cada segundo
    this.loading = true;
    const today = new Date();
    today.setDate(today.getDate() + 1);

    this.dailyMonitorSocket.on('ordersList', (data: Order[]) => {
      console.log(data);
      this.orders = data.map((order) => {
        order.created_at = new Date(order.created_at!);
        return order;
      });
      this.loading = false;
    });

    this.dailyMonitorSocket.on('message', (msg: string) => {
      const newMessage: Message = {
        severity: 'info',
        detail: msg,
        icon: 'pi pi-info-circle',
      };
      this.messageService.add(newMessage);
    });
  }

  ngOnDestroy(): void {
    this.dailyMonitorSocket.closeConnection();
  }

  constructor() {
    this.newOrderSubscription = this.dailyMonitorSocket
      .getNewOrder()
      .subscribe((order: Order) => {
        const newMessage: Message = {
          severity: 'warn',
          detail:
            'Creacion de orden con ID ' +
            order.id_order +
            ' al cliente: ' +
            order.client?.name,
          icon: 'pi pi-plus-circle',
          styleClass: 'my-0',
        };

        this.onNewOrder(order);
        this.messageService.add(newMessage);
      });
    this.updateOrderSubscription = this.dailyMonitorSocket
      .getUpdateOrder()
      .subscribe((order: Order) => {
        const newMessage: Message = {
          severity: 'info',
          detail:
            'Actualizacion de la orden ' +
            order.id_order +
            ' al cliente: ' +
            order.client?.name,
        };
        this.onUpdateNewOrder(order);
        this.messageService.add(newMessage);
      });
    this.deleteOrderSubscription = this.dailyMonitorSocket
      .getDeleteOrder()
      .subscribe((order: Order) => {
        const newMessage: Message = {
          severity: 'warn',
          detail: 'Eliminacion',
          icon: 'pi pi-info-circle',
        };
        this.messageService.add(newMessage);
        this.messages.push(newMessage);
      });
  }

  private onNewOrder(order: Order) {
    order.created_at = new Date(order.created_at!);
    this.orders.unshift(order);
  }

  private onUpdateNewOrder(order: Order) {
    order.created_at = new Date(order.created_at!);

    const index = this.orders.findIndex((o) => order.id_order === o.id_order);

    if (index !== -1) {
      this.orders[index] = order;
    } else {
      // this.orders.push(order);
    }
  }

  public updateTime(): void {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0'); // Hora en formato 24 hrs
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}:${seconds}`; // Asigna la hora en formato 24 hrs
  }

  public showOrder(order: Order): void {
    this.ref = this.dialogService.open(OrderComponent, {
      header: `Orden ${order.id_order}: ${order.client!.name} ${
        order.client!.lastname
      }`,
      draggable: true,
      styleClass: 'w-11 md:w-6',
      data: {
        order: order,
      },
    });

    this.ref.onClose.subscribe((order: Order) => {
      // if (order) {
      //   this.messageService.add({
      //     severity: 'success',
      //     summary: 'Exito!',
      //     detail: `Orden para el cliente ${
      //       order.client!.name
      //     } actualizado exitosamente`,
      //   });
      // }
    });
  }

  public createOrder(): void {
    this.ref = this.dialogService.open(OrderComponent, {
      header: `Nueva Orden`,
      draggable: true,
      styleClass: 'w-11 md:w-6',
    });

    this.ref.onClose.subscribe((order: Order) => {
      // if (order) {
      //   this.messageService.add({
      //     severity: 'success',
      //     summary: 'Exito!',
      //     detail: `Orden para el cliente ${
      //       order.client!.name
      //     } creado exitosamente`,
      //   });
      // }
    });
  }

  public showClient(client: Client) {
    this.ref = this.dialogService.open(ClientComponent, {
      header: 'Cliente: ' + client.name + ' ' + client.lastname,
      draggable: true,
      styleClass: 'w-11 md:w-7',
      data: {
        client: client,
      },
    });

    this.ref.onClose.subscribe((client: Client) => {
      if (client) {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `Cliente ${client.name} actualizado exitosamente`,
        });
      }
    });
  }

  public createClient() {
    this.ref = this.dialogService.open(ClientComponent, {
      header: 'Nuevo cliente',
      draggable: true,
      styleClass: 'w-11 md:w-7',
    });

    this.ref.onClose.subscribe((client: Client) => {
      if (client) {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `Cliente ${client.name} creado exitosamente`,
        });
      }
    });
  }

  public getOrderTime(order: Order): string {
    const now = new Date();
    if (order.created_at!.getHours() < 12) {
      order.created_at!.setHours(12, 0, 0, 0);
    }
    const diff = now.getTime() - order.created_at!.getTime();
    if (diff < 0) {
      return '00:00';
    }

    if (now.getHours() >= 15) {
      return 'F/H';
    }

    if (diff > 9000000) {
      return 'F/H';
    }

    const minutes = Math.floor(diff / 1000 / 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const baseHour = minutes < 720 ? 12 : 24;

    const adjustedMinutes = baseHour === 12 ? minutes % 720 : minutes;
    return `${this.pad(adjustedMinutes)}:${this.pad(seconds)}`;
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  public getLabelNextState(priority: number): string {
    const state = this.states().find((s) => s.priority === priority + 1);
    if (state) {
      return state.name;
    }
    return '';
  }

  public updateNextOrderState(order: Order) {
    const priority = order.state!.priority;
    const state = this.states().find((s) => s.priority === priority + 1);
    console.log(state);

    if (state) {
      const orderUpdate: Partial<Order> = {
        stateIdState: state.id_state,
        clientIdClient: order.clientIdClient,
        customerIdCustomer: order.customerIdCustomer,
        paymentTypeIdPaymentType: order.paymentTypeIdPaymentType,
        items: order.orderItems!.map(({ itemIdItem, quantity }) => ({
          itemIdItem,
          quantity,
        })),
      };
      console.log(orderUpdate);

      this.ordersService
        .updateOrder(order.id_order, orderUpdate)
        .subscribe((_) => {
          console.log(_);
        });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un error al actualizar el estado',
      });
    }
  }
}
