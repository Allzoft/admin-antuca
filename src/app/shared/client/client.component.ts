import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Client } from '@interfaces/client';
import { ClientsService } from '@services/clients.service';
import { DropdownModule } from 'primeng/dropdown';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextareaModule,
    InputTextModule,
    InputNumberModule,
    InputSwitchModule,
    ButtonModule,
  ],
  templateUrl: './client.component.html',
})
export class ClientComponent {
  public dialogService = inject(DialogService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public clientsService = inject(ClientsService);

  public client: Client = {
    id_client: 0,
    name: '',
    lastname: '',
    email: '',
    photo: '',
    code_country: '',
    phone: '',
    isActive: 0,
    id: '',
    type_business: 0,
    gender: '',
    info: '',
    google: 0,
  };

  public optionsCodeCountries: { flag: string; code: string }[] = [
    {
      flag: 'https://www.worldstatesmen.org/bo_s.gif',
      code: '+591',
    },
  ];

  public selectedCodeCountry: { flag: string; code: string } = {
    flag: 'https://www.worldstatesmen.org/bo_s.gif',
    code: '+591',
  };

  constructor() {
    if (this.config.data) {
      this.client = this.config.data.client;
      const country = this.optionsCodeCountries.find(
        (code) => code.code === this.client.code_country
      );
      if (country) {
        this.selectedCodeCountry = country;
      }
    }
  }

}
