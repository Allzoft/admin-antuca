import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PipesModule } from '../../../pipes/pipes.module';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, TitleComponent, ButtonModule, CardModule, TableModule, PipesModule],
  templateUrl: './clients.component.html',
})
export default class ClientsComponent {
  clients: [] = []
}
