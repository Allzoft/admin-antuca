import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
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
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Items } from '@interfaces/items';
import { ToastModule } from 'primeng/toast';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ItemComponent } from '@shared/item/item.component';

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
  public itemsService = inject(ItemsService);
  public dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  public configRef = inject(DynamicDialogConfig);

  public items = this.itemsService.items;
  public star = 4;
  public ref: DynamicDialogRef | undefined;

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
          severity: 'info',
          summary: 'Exito!',
          detail: `Item ${item.name} creado o actualizo exitosamente`,
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
  }

  public refreshData() {
    this.itemsService.getItems();
  }
}
