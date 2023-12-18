import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, CardModule, TitleComponent, TableModule, ButtonModule],
  templateUrl: './orders.component.html',
})
export default class OrdersComponent {}
