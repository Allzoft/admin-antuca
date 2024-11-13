import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '@services/layout.service';
import { Message, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-daily-monitor',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    MessagesModule,
  ],
  providers: [MessageService],
  templateUrl: './daily-monitor.component.html',
})
export default class DailyMonitorComponent implements OnInit {
  public layoutService = inject(LayoutService);
  public currentTime: string = '';

  public filterRoleSelect: string = 'Cocina';
  public filterOptionsRole: string[] = ['Cocina'];

  public messages: Message[] = [
    { severity: 'success', detail: 'Nuevo pedido confirmado', icon:'pi pi-plus-circle' },
    { severity: 'secondary', detail: 'No olviden sacar el pizarron', icon:'pi pi-eye' },
    { severity: 'error', detail: 'Pedido #43 Cancelado', icon:'pi pi-times-circle' },
    { severity: 'success', detail: 'Pedido completado',  },
    { severity: 'warn', detail: 'Pedido en barra',  },
    { severity: 'info', detail: 'El pedido 34 tiene 5 minutos de retraso',  },
    { severity: 'contrast', detail: 'Ya son las 12:00. ¡Hora de abrir!', icon: 'pi pi-bell'  },
  ];

  ngOnInit(): void {
    this.updateTime(); // Llamamos a la función inicialmente
    setInterval(() => this.updateTime(), 1000); // Actualizamos cada segundo
  }

  updateTime(): void {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0'); // Hora en formato 24 hrs
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}:${seconds}`; // Asigna la hora en formato 24 hrs
  }
}
