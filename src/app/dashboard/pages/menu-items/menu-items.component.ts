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
  providers: [ConfirmationService, MessageService],
  templateUrl: './menu-items.component.html',
})
export default class MenuItemsComponent {
  public itemsService = inject(ItemsService);
  public items = this.itemsService.items;
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  public star = 4;

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
}
