import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ItemsService } from '@services/items.service';
import { TitleComponent } from '@shared/title/title.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataView, DataViewModule } from 'primeng/dataview';
import { PipesModule } from '../../../pipes/pipes.module';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ImageModule } from 'primeng/image';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Items } from '@interfaces/items';
import { ToastModule } from 'primeng/toast';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ItemComponent } from '@shared/item/item.component';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import moment from 'moment';
import { InputNumberModule } from 'primeng/inputnumber';
import { DailyAvailabilityServices } from '../../../services/dailyAvailability.service';
import { DailyAvailability } from '@interfaces/dailyAvailability';
import { LayoutService } from '@services/layout.service';

@Component({
  selector: 'app-menu-items',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DataViewModule,
    PipesModule,
    RatingModule,
    TagModule,
    InputTextModule,
    ImageModule,
    ConfirmDialogModule,
    ToastModule,
    DropdownModule,
    OverlayPanelModule,
    CalendarModule,
    InputNumberModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DialogService,
    DynamicDialogConfig,
  ],
  templateUrl: './menu-items.component.html',
})
export default class MenuItemsComponent implements OnDestroy, OnInit {
  public layoutService = inject(LayoutService);
  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);
  public itemsService = inject(ItemsService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private dailyAvailabilityServices = inject(DailyAvailabilityServices);

  @ViewChild('op') op!: OverlayPanel;
  @ViewChild('op2') op2!: OverlayPanel;
  @ViewChild('dv') dv!: DataView;

  public items: Items[] = [];
  public filteredItems: Items[] = [];
  public star = 4;
  public ref: DynamicDialogRef | undefined;

  public sortOptions: { value: string; severity: string }[] = [
    { value: 'Disponible', severity: 'success' },
    { value: 'Agotado', severity: 'danger' },
  ];

  public showFilters: boolean = false;

  public selectSort: { value: string; severity: string } | undefined;

  public selectedItem: Items | undefined;

  public date = moment().format('YYYY-MM-DD');
  public quantity: number | undefined;
  public quantityDirty: boolean = false;
  public loadingAvailable: boolean = false;

  public selectAvailable?: Partial<DailyAvailability> = {
    date: moment().format('YYYY-MM-DD'),
    itemIdItem: 0,
    quantity: 0,
  };

  ngOnInit(): void {
    this.itemsService.getItems().subscribe((res) => {
      this.filteredItems = [...res];
      console.log(res);

      const today = new Date();
      today.setDate(today.getDate() + 1); // quitar para prod

      this.dailyAvailabilityServices
        .getAllByDatesDailyAvailability(today, today)
        .subscribe((res) => {
          // Asociar las dailyAvailabilities con sus items correspondientes
          res.forEach((dailyAvailability) => {
            this.filteredItems.forEach((item) => {
              if (item.id_item === dailyAvailability.itemIdItem) {
                item.dailyAvailabilities = item.dailyAvailabilities || []; // Inicializar si no existe
                item.dailyAvailabilities.push(dailyAvailability);
              }
            });
          });

          // Ordenar los items: los que tienen dailyAvailabilities primero
          this.filteredItems.sort((a, b) => {
            const aHasAvailability =
              a.dailyAvailabilities && a.dailyAvailabilities.length > 0;
            const bHasAvailability =
              b.dailyAvailabilities && b.dailyAvailabilities.length > 0;

            return aHasAvailability === bHasAvailability
              ? 0
              : aHasAvailability
              ? -1
              : 1;
          });

          this.items = this.filteredItems;

          console.log(this.items); // Verificar el orden
        });
    });
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  public deleteItem(item: Items) {
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar ' + item.name,
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-rounded p-button-success w-7rem',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-warning w-7rem',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.itemsService.deleteItems(item.id_item).subscribe((_) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminación exitosa',
            detail: `${item.name} eliminado exitosamente`,
          });
        });
      },
    });
  }

  public showItem(item: Items) {
    this.ref = this.dialogService.open(ItemComponent, {
      header: item.name,
      draggable: true,
      styleClass: 'w-11 md:w-5',
      data: {
        item: item,
      },
    });

    this.ref.onClose.subscribe((item: Items) => {
      if (item) {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `Item ${item.name} actualizado exitosamente`,
        });
        const index = this.items.findIndex((it) => it.id_item === item.id_item);
        this.items[index] = item;
      }
    });
  }

  public createItem() {
    this.ref = this.dialogService.open(ItemComponent, {
      header: 'Nuevo plato',
      draggable: true,
      styleClass: 'w-11 md:w-5',
    });

    this.ref.onClose.subscribe((item: Items) => {
      if (item) {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `Item ${item.name} creado exitosamente`,
        });
        this.items.push(item);
      }
    });
  }

  public refreshData() {
    this.itemsService.getItems();
  }

  public customGlobalFilter(event: any) {
    const filterValue = event.target.value.trim().toLowerCase();
    const filterWords = filterValue.split(' ');

    const itemsFiltered = this.filteredItems.filter((rowData: Items) => {
      const fullName = `${rowData.name}`.toLowerCase();
      if (fullName === filterValue) {
        return true;
      }
      const wordsPresent = filterWords.filter((word: any) => {
        return fullName.includes(word);
      });

      return wordsPresent.length === filterWords.length;
    });

    this.itemsService.updateItems(itemsFiltered);
  }

  public onSelectedItem(item: Items) {
    this.selectedItem = item;
    this.quantity = 0;
  }

  public onSelectedAvailable(
    item: Items,
    dailyAvailability: DailyAvailability
  ) {
    this.selectedItem = item;
    this.selectAvailable = dailyAvailability;
  }

  public updateAvailability() {
    if (!this.selectAvailable!.quantity) {
      this.quantityDirty = true;
      return;
    }

    const newAvailability: Partial<DailyAvailability> = {
      date:
        moment(this.selectAvailable!.date).format('YYYY-MM-DD') +
        'T04:00:00.0000Z',
      quantity: this.selectAvailable!.quantity,
    };
    this.dailyAvailabilityServices
      .updateDailyAvailability(
        this.selectAvailable?.id_daily_availability!,
        newAvailability
      )
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exito!',
            detail: `Disponibilidad de ${res.quantity} items de ${
              this.selectedItem!.name
            } actualizada exitosamente`,
          });
          const index = this.items.findIndex(
            (i) => i.id_item === res.itemIdItem
          );
          this.items[index].dailyAvailabilities![0] = res;
          this.op2.hide();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        }
      );
  }

  public createAvailability() {
    if (!this.quantity) {
      this.quantityDirty = true;
      return;
    }

    const newAvailability: Partial<DailyAvailability> = {
      date: moment(this.date).format('YYYY-MM-DD') + 'T04:00:00.0000Z',
      quantity: this.quantity,
      itemIdItem: this.selectedItem!.id_item,
    };
    this.dailyAvailabilityServices
      .postDailyAvailability(newAvailability)
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exito!',
            detail: `Disponibilidad de ${res.quantity} items de ${
              this.selectedItem!.name
            } creada exitosamente`,
          });
          this.op.hide();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        }
      );
  }
}
