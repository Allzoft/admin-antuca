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
import { SelectButtonModule } from 'primeng/selectbutton';
import { MeterGroupModule } from 'primeng/metergroup';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { ChartData } from 'chart.js';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
    SelectButtonModule,
    CalendarModule,
    ChartModule,
    CalendarModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    ToastModule,
    MeterGroupModule,
    OverlayPanelModule,
    DropdownModule,
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

  public filterDate: Date[] = [new Date(), new Date()];

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

  public stateOptions: { label: string; value: string }[] = [
    { label: 'Mensual', value: '0' },
    { label: 'Semanal', value: '1' },
    { label: 'Hoy', value: '2' },
  ];

  value: { label: string; value: string } = { label: 'Hoy', value: '2' };

  public dateIncomeOptions: string[] = ['Mensual', 'Semanal', 'Hoy'];
  public dateIncomeSelected: string = 'Mensual';

  public filteredOrders = [...this.ordersService.orders()];

  public selectOrder: Order | undefined;

  public ref: DynamicDialogRef | undefined;

  public loadingOrders(): boolean {
    return false;
  }

  public menuItems: DailyAvailability[] = [];

  public feedBackStars: { fill: boolean }[] = [
    { fill: true },
    { fill: true },
    { fill: true },
    { fill: true },
    { fill: false },
  ];

  documentStyle = getComputedStyle(document.documentElement);
  textColor = this.documentStyle.getPropertyValue('--text-color');

  valueMeter = [
    {
      label: 'En sala',
      value: 50,
      color: this.documentStyle.getPropertyValue('--yellow-400'),
    },
    {
      label: 'Delivery',
      value: 20,
      color: this.documentStyle.getPropertyValue('--bluegray-500'),
    },
    {
      label: 'Para llevar',
      value: 30,
      color: this.documentStyle.getPropertyValue('--primary-500'),
    },
  ];

  data: ChartData;

  options: any;

  dataBar: ChartData;
  optionsBar: any;

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
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
      ],
      datasets: [
        {
          label: 'Ingresos',
          fill: {
            target: 'origin',

            above: 'rgba(239, 241, 106, 0.1)',
            below: 'rgba(255, 255, 102, 0.1)',
          },
          borderColor: documentStyle.getPropertyValue('--primary-300'),
          backgroundColor: documentStyle.getPropertyValue('--primary-300'),
          yAxisID: 'y',
          tension: 0.4,
          data: [
            24540, 16308, 16980, 15041, 21322, 24619, 22298, 22285, 21017,
            22613, 18149,
          ],
          pointRadius: 1.5,
        },
        {
          label: 'Salidas',
          fill: {
            target: 'origin',
            above: 'rgba(255, 165, 0, 0.1)',
            below: 'rgba(255, 184, 77, 0.1)',
          },
          borderColor: documentStyle.getPropertyValue('--orange-400'),
          backgroundColor: documentStyle.getPropertyValue('--orange-400'),
          yAxisID: 'y1',
          tension: 0.4,
          data: [
            19774, 19634, 22028, 17586, 16489, 22527, 15471, 23557, 24971,
            20838, 19575,
          ],
          pointRadius: 1.5,
        },
      ],
    };

    this.options = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: '',
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            count: 6,
            color: textColorSecondary,
            callback: function (value: number) {
              if (value >= 1000) {
                return value / 1000 + 'k';
              }
              return value;
            },
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y1: {
          display: false,
        },
      },
    };

    this.dataBar = {
      labels: [
        'Ene',
        'Feb',
        'Maz',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
      ],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: documentStyle.getPropertyValue('--primary-300'),
          borderColor: documentStyle.getPropertyValue('--primary-300'),
          data: [65, 59, 80, 81, 56, 55, 40, 15, 30, 21, 12],
          categoryPercentage: 0.4,
          borderRadius: 5,
        },
      ],
    };

    this.optionsBar = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            callback: function (value: number) {
              return value === 0 ? '' : value;
            },
            color: textColorSecondary,
            count: 4,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
            borderColor: 'transparent',
          },
        },
      },
    };
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
