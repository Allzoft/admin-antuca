import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ClientsService } from '@services/clients.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client.component.html',
})
export class ClientComponent {
  public dialogService = inject(DialogService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public clientsService = inject(ClientsService);
}
