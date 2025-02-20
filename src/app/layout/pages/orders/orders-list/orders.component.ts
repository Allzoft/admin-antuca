import { CommonModule } from '@angular/common';
import { Component, OnDestroy, Signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Client } from '@interfaces/client';
import { Items } from '@interfaces/items';
import { Order, OrderItems } from '@interfaces/order';
import { LayoutService } from '@services/layout.service';
import { OrdersService } from '@services/orders.service';
import { StatesService } from '@services/states.service';
import { ClientComponent } from '@shared/client/client.component';
import { ItemComponent } from '@shared/item/item.component';
import { OrderComponent } from '@shared/order/order.component';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { PipesModule } from '../../../../pipes/pipes.module';

@Component({
    selector: 'app-orders',
    imports: [
        FormsModule,
        CommonModule,
        PipesModule,
        DataViewModule,
        TableModule,
        DropdownModule,
        ButtonModule,
        TagModule,
        TieredMenuModule,
        ToastModule,
        ConfirmDialogModule,
    ],
    providers: [
        ConfirmationService,
        MessageService,
        DialogService,
        DynamicDialogConfig,
    ],
    templateUrl: './orders.component.html'
})
export default class OrdersComponent implements OnDestroy {
  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);
  public ordersService = inject(OrdersService);
  public statesService = inject(StatesService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  public layoutService = inject(LayoutService);

  public orders: Signal<Order[]> = this.ordersService.orders;
  public selectOrder: Order | undefined;

  public ref: DynamicDialogRef | undefined;

  public options: string[] = ['Última semana', 'Último mes', 'Personalizado'];
  public filterDateSelect: string = 'Última semana';

  public optionsFilterState: string[] = this.statesService.states().map((s) => {
    return s.name;
  });
  public filterStateSelect: string = 'Todos los estados';

  public loadingOrderImpress: boolean = false;

  public items: MenuItem[] = [
    {
      label: 'Borrar',
      icon: 'pi pi-trash',
      command: () => {
        this.confirmationService.confirm({
          message: '¿Está seguro de eliminar esta orden?',
          acceptLabel: 'Si',
          acceptButtonStyleClass: 'p-button-rounded p-button-success w-28',
          rejectLabel: 'No',
          rejectButtonStyleClass: 'p-button-rounded p-button-warning w-28',
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
    this.statesService.getAllStates();
    this.refreshData();
    this.optionsFilterState.push('Todos los estados');
  }

  public ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  public refreshData(): void {
    this.ordersService.getOrders();
  }

  public selectOptionOrder(order: Order): void {
    this.selectOrder = order;
  }

  public deleteOrder(order: Order) {
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar la Orden',
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-rounded p-button-success w-28',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-warning w-28',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.deleteOrders(order.id_order).subscribe((_) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminación exitosa',
            detail: `Orden eliminada exitosamente`,
          });
        });
      },
    });
  }

  public showClient(client: Client): void {
    this.ref = this.dialogService.open(ClientComponent, {
      header: 'Client: ' + client.name + ' ' + client.lastname,
      draggable: true,
      styleClass: 'w-11/12 md:w-7/12',
      data: {
        client: client,
        disabled: true,
      },
    });
  }

  public showItem (item: Items): void {
    this.ref = this.dialogService.open(ItemComponent, {
      header: 'Item: ' + item.name,
      draggable: true,
      styleClass: 'w-11/12 md:w-5/12',
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
      styleClass: 'w-11/12 md:w-6/12',
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
      }
    });
  }

  public createOrder(): void {
    this.ref = this.dialogService.open(OrderComponent, {
      header: `Nueva Orden`,
      draggable: true,
      styleClass: 'w-11/12 md:w-6/12',
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
    });
  }

  public getOrders = (orderItems: OrderItems[]): string => {
    return orderItems
      .map((i) => {
        return i.quantity + ' ' + i.item.name;
      })
      .join(', ');
  };

  public get totalAmount(): number {
    return this.orders().reduce(
      (total, order) => total + +order.total_amount,
      0
    );
  }

  public getImpressOrder(order: Order) {
    this.loadingOrderImpress = true;
    this.ordersService.getImpressOrder(order.id_order).subscribe((res) => {
      this.loadingOrderImpress = false;
      const url = window.URL.createObjectURL(res);

      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);
    });
  }
}
