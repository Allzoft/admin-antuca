import { CommonModule } from '@angular/common';
import { Component, Signal, computed, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { OrdersService } from '@services/orders.service';
import { LayoutService } from '@services/layout.service';
import { Order } from '@interfaces/order';
import moment from 'moment';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Client } from '@interfaces/client';
import { ClientComponent } from '@shared/client/client.component';
import { ItemComponent } from '@shared/item/item.component';
import { Items } from '@interfaces/items';
import { OrderComponent } from '@shared/order/order.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { StatesService } from '../../../services/states.service';
import { State } from '@interfaces/state';
import { DailyAvailabilityServices } from '@services/dailyAvailability.service';
import { DailyAvailability } from '@interfaces/dailyAvailability';
import { PipesModule } from '../../../pipes/pipes.module';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-daily-summary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CarouselModule,
    SkeletonModule,
    ButtonModule,
    TieredMenuModule,
    TagModule,
    CardModule,
    CalendarModule,
    CalendarModule,
    ConfirmDialogModule,
    ToastModule,
    OverlayPanelModule,
    PipesModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DialogService,
    DynamicDialogConfig,
  ],
  templateUrl: './daily-summary.component.html',
})
export default class DailySummaryComponent {
  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);
  public layoutService = inject(LayoutService);
  public statesService = inject(StatesService);
  public ordersService = inject(OrdersService);
  public dailyAvailabilityService = inject(DailyAvailabilityServices);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  public  filterDate: Date = new Date();

  public date = moment().format('YYYY-MM-DD');
  public signalDate = signal(moment().format('YYYY-MM-DD'));

  public orders: Signal<Order[]> = computed(() =>
    this.ordersService
      .orders()
      .filter(
        (order) => moment(order.date).format('YYYY-MM-DD') === this.signalDate()
      )
      .sort((a, b) => {
        const priorityA = a.state?.priority || 0;
        const priorityB = b.state?.priority || 0;
        return priorityB - priorityA;
      })
  );

  public filteredOrders = [...this.ordersService.orders()];

  public selectOrder: Order | undefined;

  public ref: DynamicDialogRef | undefined;

  public loadingOrders = this.ordersService.loading;

  public menuItems: DailyAvailability[] = [];

  public feedBackStars: { fill: boolean }[] = [
    { fill: true },
    { fill: true },
    { fill: true },
    { fill: true },
    { fill: false },
  ];

  public items: MenuItem[] = [
    {
      label: 'Borrar',
      icon: 'pi pi-trash',
      command: () => {
        this.confirmationService.confirm({
          message: '¿Está seguro de eliminar esta orden?',
          acceptLabel: 'Si',
          acceptButtonStyleClass: 'p-button-rounded p-button-success w-7rem',
          rejectLabel: 'No',
          rejectButtonStyleClass: 'p-button-rounded p-button-warning w-7rem',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.ordersService
              .deleteOrders(this.selectOrder!.id_order)
              .subscribe((_) => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Eliminación exitosa',
                  detail: `Orden eliminada exitosamente`,
                });
              });
          },
        });
      },
    },
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => {
        this.showOrder(this.selectOrder!);
      },
    },
  ];

  constructor() {
    // this.dailyAvailabilityService
    //   .getAllByDatesDailyAvailability(
    //     moment(this.signalDate()).format('YYYY-MM-DD') + 'T04:00:00.0000Z',
    //     moment(this.signalDate()).format('YYYY-MM-DD') + 'T04:00:00.0000Z'
    //   )
    //   .subscribe(
    //     (res) => {
    //       this.menuItems = res;
    //     },
    //     (error) => {
    //       this.menuItems = [];
    //     }
    //   );
  }

  selectOptionOrder(order: Order): void {
    this.selectOrder = order;
  }

  searchByDate(date: Date): void {
    // this.signalDate.set(moment(date).format('YYYY-MM-DD'));
    // this.dailyAvailabilityService
    //   .getAllByDatesDailyAvailability(
    //     moment(this.signalDate()).format('YYYY-MM-DD') + 'T04:00:00.0000Z',
    //     moment(this.signalDate()).format('YYYY-MM-DD') + 'T04:00:00.0000Z'
    //   )
    //   .subscribe(
    //     (res) => {
    //       this.menuItems = res;
    //     },
    //     (error) => {
    //       this.menuItems = [];
    //     }
    //   );
  }

  public showClient(client: Client): void {
    this.ref = this.dialogService.open(ClientComponent, {
      header: 'Client: ' + client.name + ' ' + client.lastname,
      draggable: true,
      styleClass: 'w-11 md:w-7',
      data: {
        client: client,
        disabled: true,
      },
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

  public showItem(item: Items): void {
    this.ref = this.dialogService.open(ItemComponent, {
      header: 'Item: ' + item.name,
      draggable: true,
      styleClass: 'w-11 md:w-5',
      data: {
        item: item,
        disabled: true,
      },
    });
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
      if (order) {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `Orden para el cliente ${
            order.client!.name
          } actualizado exitosamente`,
        });
        const aDate = moment(this.signalDate())
          .subtract(1, 'days')
          .format('YYYY-MM-DD');
        this.signalDate.set(aDate);
        const bDate = moment(this.signalDate())
          .add(1, 'days')
          .format('YYYY-MM-DD');
        this.signalDate.set(bDate);
      }
    });
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
      const aDate = moment(this.signalDate())
        .subtract(1, 'days')
        .format('YYYY-MM-DD');
      this.signalDate.set(aDate);
      const bDate = moment(this.signalDate())
        .add(1, 'days')
        .format('YYYY-MM-DD');
      this.signalDate.set(bDate);
    });
  }

  public refreshData(): void {
    this.ordersService.getOrders();
  }

  public stateFilter(state: State) {
    const ordersFiltered = this.filteredOrders.filter((order) => {
      return order.state?.id_state === state.id_state;
    });
    this.ordersService.updateOrders(ordersFiltered);
  }

  public cleanFilter() {
    this.ordersService.updateOrders(this.filteredOrders);
  }

  public getItemSales(item: DailyAvailability): number {
    let idItem = item.itemIdItem;
    let countItems = 0;
    this.orders().forEach((o) => {
      if (o.state!.name !== 'Orden perdida') {
        o.orderItems!.forEach((order) => {
          if (order.itemIdItem === idItem) {
            countItems += order.quantity;
          }
        });
      }
    });
    return countItems;
  }

  public removeMenuItem(item: DailyAvailability) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar la disponibilidad del item?',
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-rounded p-button-success w-7rem',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-warning w-7rem',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dailyAvailabilityService
          .deleteDailyAvailability(item.id_daily_availability)
          .subscribe((_) => {
            const i = this.menuItems.findIndex(
              (m) => m.id_daily_availability === item.id_daily_availability
            );
            if (i !== -1) {
              this.menuItems.splice(i, 1);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminación exitosa',
              detail: `Disponibilidad eliminada exitosamente`,
            });
          });
      },
    });
  }

  public get totalAmount(): number {
    let total = 0;
    this.orders().forEach((o) => {
      total += +o.total_amount;
    });
    return total;
  }

  public get totalAcount(): number {
    let count = 0;
    this.orders().forEach((o) => {
      if (o.state) {
        if (o.state!.name !== 'Orden perdida') {
          o.orderItems!.forEach((order) => {
            count += order.quantity;
          });
        }
      }
    });
    return count;
  }

  public get stock(): number {
    let count = 0;
    this.menuItems.forEach((m) => {
      count += +m.quantity;
    });
    return count;
  }
}
