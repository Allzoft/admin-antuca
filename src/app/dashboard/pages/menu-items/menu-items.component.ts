import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { ItemsService } from '@services/items.service';
import { TitleComponent } from '@shared/title/title.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
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

@Component({
  selector: 'app-menu-items',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
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
export default class MenuItemsComponent implements OnDestroy {
  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);
  public itemsService = inject(ItemsService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private dailyAvailabilityServices = inject(DailyAvailabilityServices);

  @ViewChild('op') op!: OverlayPanel;

  public items = this.itemsService.items;
  public filteredItems = [...this.itemsService.items()];
  public star = 4;
  public ref: DynamicDialogRef | undefined;

  public sortOptions: { value: string; severity: string }[] = [
    { value: 'Disponible', severity: 'success' },
    { value: 'Agotado', severity: 'danger' },
  ];

  public selectSort: { value: string; severity: string } | undefined;

  public selectedItem: Items | undefined;

  public date = moment().format('YYYY-MM-DD');
  public quantity: number | undefined;
  public quantityDirty: boolean = false;
  public loadingAvailable: boolean = false;

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

  sortData(event: DropdownChangeEvent) {
    console.log(event.value);
    if (event.value.value === 'Disponible') {
      const newOrderItems = this.items().sort(
        (a: Items, b: Items) => b.available - a.available
      );
      this.itemsService.updateItems(newOrderItems);
    } else {
      const newOrderItems = this.items().sort(
        (a: Items, b: Items) => a.available - b.available
      );
      this.itemsService.updateItems(newOrderItems);
    }
  }

  public createAvailability() {
    if (!this.quantity) {
      this.quantityDirty = true;
      return;
    }

    const updateItem: Partial<Items> = {
      available: 1,
    };

    const newAvailability: Partial<DailyAvailability> = {
      date: moment(this.date).format('YYYY-MM-DD') + 'T04:00:00.0000Z',
      quantity: this.quantity,
      itemIdItem: this.selectedItem!.id_item,
    };

    this.itemsService
      .updateItem(this.selectedItem!.id_item, updateItem)
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail:
            'Disponibilidad de item ' + res.name + ' actualizada exitosamente',
        });
        this.dailyAvailabilityServices
          .postDailyAvailability(newAvailability)
          .subscribe((resA) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Exito!',
              detail: `Disponibilidad de ${resA.quantity} items de ${res.name} creada exitosamente`,
            });
            this.op.hide()
          });
      });
  }
}
