import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PipesModule } from '../../../pipes/pipes.module';
import { Client } from '@interfaces/client';
import { ClientsService } from '@services/clients.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ClientComponent } from '@shared/client/client.component';

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
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DialogService,
    DynamicDialogConfig,
  ],
  templateUrl: './clients.component.html',
})
export default class ClientsComponent implements OnDestroy {
  public clientsService = inject(ClientsService);
  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  public ref: DynamicDialogRef | undefined;

  public clients = this.clientsService.clients;
  public filteredItems = [...this.clientsService.clients()];

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  public refreshData() {
    this.clientsService.getClient();
  }

  public deleteClient(client: Client) {
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar ' + client.name + ' ' + client.lastname,
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-rounded p-button-success w-7rem',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-warning w-7rem',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientsService.deleteClient(client.id_client).subscribe((_) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminación exitosa',
            detail: `${client.name} eliminado exitosamente`,
          });
        });
      },
    });
  }

  public showClient(client: Client) {
    this.ref = this.dialogService.open(ClientComponent, {
      header: client.name + ' ' + client.lastname,
      draggable: true,
      styleClass: 'w-11 md:w-5',
      data: {
        client: client,
      },
    });

    this.ref.onClose.subscribe((client: Client) => {
      if (client) {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `Cliente ${client.name} actualizado exitosamente`,
        });
      }
    });
  }

  public createClient() {
    this.ref = this.dialogService.open(ClientComponent, {
      header: 'Nuevo cliente',
      draggable: true,
      styleClass: 'w-11 md:w-5',
    });

    this.ref.onClose.subscribe((client: Client) => {
      if (client) {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `Cliente ${client.name} creado exitosamente`,
        });
      }
    });
  }
}
