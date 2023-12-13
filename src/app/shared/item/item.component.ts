import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Items } from '@interfaces/items';
import { ItemsService } from '@services/items.service';
import { environment } from '@environment/environment';

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    ButtonModule,
    ImageModule,
    DropdownModule,
    FileUploadModule
  ],
  providers: [DynamicDialogRef],
  templateUrl: './item.component.html',
})
export class ItemComponent {
  public itemsService = inject(ItemsService);
  public ref = inject(DynamicDialogRef);

  public url = environment.url_public + '/uploads/'

  public typeAvailable: { label: string; isSelect: boolean }[] = [
    { label: 'Disponible', isSelect: true },
    { label: 'Agotado', isSelect: false },
  ];

  public typeItems: { code: number; label: string }[] = [
    { code: 0, label: 'Sopa' },
    { code: 1, label: 'Segundo' },
    { code: 2, label: 'Otro' },
  ];

  public item: Items = {
    id_item: 0,
    name: '',
    price: 12,
    available: 1,
    description: '',
    photo: '',
    type_item: 1,
  };

  public type_item: { code: number; label: string } | undefined;

  constructor() {
    if (this.itemsService.selectItem) {
      this.item = this.itemsService.selectItem;
      this.type_item = this.typeItems.find(
        (i) => i.code === this.item.type_item
      );
    }
  }

  public selectTypeAvailable(i: number) {
    this.typeAvailable.forEach((t) => (t.isSelect = false));
    this.typeAvailable[i].isSelect = true;
  }
}
