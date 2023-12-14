import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PipesModule } from '../../../pipes/pipes.module';
import { Client } from '@interfaces/client';
import { ClientsService } from '@services/clients.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    ButtonModule,
    CardModule,
    TableModule,
    PipesModule,
  ],
  templateUrl: './clients.component.html',
})
export default class ClientsComponent {
  public clientsService = inject(ClientsService);

  public clients = this.clientsService.clients;

  public refreshData() {
    this.clientsService.getClient();
  }
}
