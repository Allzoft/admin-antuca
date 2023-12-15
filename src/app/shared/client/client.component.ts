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

  public inputNameDirt: boolean = false;
  public inputPhoneDirt: boolean = false;

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

  public async saveClient() {
    if (!(await this.passClientForm())) return;

    const newClient: Partial<Client> = {
      name: this.client.name,
      lastname: this.client.lastname,
      email: this.client.email,
      photo: this.client.photo,
      code_country: this.selectedCodeCountry.code,
      phone: this.client.phone,
      isActive: this.client.isActive,
      id: this.client.id,
      type_business: this.client.type_business,
      gender: this.client.gender,
      info: this.client.info,
      google: this.client.google,
    };
    if (this.client.id_client === 0) {
      this.clientsService.postClient(newClient).subscribe((resClient) => {
        this.ref.close(resClient);
      });
    } else {
      this.clientsService
        .updateClient(this.client.id_client, newClient)
        .subscribe((resClient) => {
          this.ref.close(resClient);
        });
    }
  }

  public passClientForm(): Promise<boolean> {
    if (!this.client.name) {
      this.inputNameDirt = true;
      return Promise.resolve(false);
    }
    if (!this.client.phone) {
      this.inputPhoneDirt = true;
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }
}
