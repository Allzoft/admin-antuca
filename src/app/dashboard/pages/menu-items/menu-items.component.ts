import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
  providers: [ConfirmationService, MessageService, DialogService, DynamicDialogConfig],
  templateUrl: './menu-items.component.html',
})
export default class MenuItemsComponent {
  public itemsService = inject(ItemsService);
  public dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  public configRef = inject(DynamicDialogConfig)

  public items = this.itemsService.items;
  public star = 4;
  public ref: DynamicDialogRef | undefined;

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
    this.itemsService.selectItem = item
    this.ref = this.dialogService.open(ItemComponent, {
      data: {
        item: item,
        id: 654654
      },
      header: item.name,
      draggable: true,
      styleClass: 'w-11 md:w-5',
    });

    this.ref.onClose.subscribe((item: Items) => {
      console.log(item);

      if (item) {
        this.messageService.add({
          severity: 'info',
          summary: 'item Selected',
          detail: item.name,
        });
      }
    });
  }
}
