import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CustomersService } from '@services/customers.service';
import { LayoutService } from '@services/layout.service';
import { SidemenuComponent } from '@shared/sidemenu/sidemenu.component';
import { TopbarComponent } from '@shared/topbar/topbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidemenuComponent, TopbarComponent],
  templateUrl: './dashboard.component.html',

})
export default class DashboardComponent {
  private customerService = inject(CustomersService);
  public layoutService = inject(LayoutService);

}
