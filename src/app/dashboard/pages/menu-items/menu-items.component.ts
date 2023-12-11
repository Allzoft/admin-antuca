import { CommonModule } from '@angular/common';
import {  Component } from '@angular/core';

@Component({
  selector: 'app-menu-items',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './menu-items.component.html',
})
export default class MenuItemsComponent { }
