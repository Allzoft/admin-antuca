import { CommonModule } from '@angular/common';
import {  Component, inject } from '@angular/core';
import { CustomersService } from '@services/customers.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
})
export default class DashboardComponent {
  private customerService = inject(CustomersService)

}
