import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Items, TypeItem } from '@interfaces/items';
import { ItemsService } from '@services/items.service';
import { environment } from '@environment/environment';

import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { UploadService } from '@services/upload.service';

@Component({
  selector: 'app-item',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
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

  public typeItems: string[] = Object.values(TypeItem);

  public item: Items = {
    id_item: 0,
    name: '',
    price: 0,
    description: '',
    photo: '',
    type_item: TypeItem.SEGUNDO,
  };

  public type_item: { code: number; label: string } | undefined = {
    code: 1,
    label: 'Segundo',
  };

  public inputDirt: boolean = false;

  constructor() {
    if (this.config.data) {
      this.item = this.config.data.item;
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
      type_item: this.item.type_item,
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
