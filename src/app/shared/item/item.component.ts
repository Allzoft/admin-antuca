import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Items } from '@interfaces/items';
import { ItemsService } from '@services/items.service';
import { environment } from '@environment/environment';

import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { UploadService } from '@services/upload.service';

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
    FileUploadModule,
  ],
  templateUrl: './item.component.html',
})
export class ItemComponent {
  public dialogService = inject(DialogService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public itemsService = inject(ItemsService);
  public uploadService = inject(UploadService);

  public url = environment.url_public + '/uploads/';

  public typeAvailable: { label: string; isSelect: boolean }[] = [
    { label: 'Disponible', isSelect: true },
    { label: 'Agotado', isSelect: false },
  ];

  public typeItems: { code: number; label: string }[] = [
    { code: 0, label: 'Sopa o entrante' },
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

  public type_item: { code: number; label: string } | undefined = {
    code: 1,
    label: 'Segundo',
  };

  public inputDirt: boolean = false;

  constructor() {
    if (this.config.data) {
      this.item = this.config.data.item;
      this.type_item = this.typeItems.find(
        (i) => i.code === this.item.type_item
      );
      if (this.item.available === 0) {
        this.typeAvailable[0].isSelect = false;
        this.typeAvailable[1].isSelect = true;
      }
    }
  }

  public selectTypeAvailable(i: number) {
    this.typeAvailable.forEach((t) => (t.isSelect = false));
    this.typeAvailable[i].isSelect = true;
  }

  public onUpload(event: any) {
    console.log(event);

    if (event.files.length > 0) {
      const file = event.files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.uploadService.uploadfile(formData).subscribe((res) => {
        console.log(res);
        this.item.photo = res['filename'];
      });
    }
  }

  public async saveItem() {
    if (!(await this.passItemForm())) return;

    const newItem: Partial<Items> = {
      name: this.item.name,
      price: this.item.price,
      description: this.item.description,
      available: this.typeAvailable[0].isSelect ? 1 : 0,
      type_item: this.type_item!.code,
      photo: this.item.photo,
    };
    if (this.item.id_item === 0) {
      this.itemsService.postItem(newItem).subscribe((resItem) => {
        console.log(resItem);

        this.ref.close(resItem);
      });
    } else {
      this.itemsService
        .updateItem(this.item.id_item, newItem)
        .subscribe((resItem) => {
          this.ref.close(resItem);
        });
    }
  }

  public passItemForm(): Promise<boolean> {
    if (!this.item.name) {
      this.inputDirt = true;
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }
}
