import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';

@Component({
  selector: 'app-menu-items',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    ButtonModule,
    CardModule,
    DataViewModule,
  ],
  templateUrl: './menu-items.component.html',
})
export default class MenuItemsComponent {}
