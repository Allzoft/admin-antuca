import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '@services/layout.service';
import { SidemenuComponent } from '@shared/sidemenu/sidemenu.component';
import { TopbarComponent } from '@shared/topbar/topbar.component';
import UserComponent from './pages/user/user.component';
import { SidebarModule } from 'primeng/sidebar';
import { CustomersService } from '@services/customers.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidemenuComponent,
    TopbarComponent,
    RouterOutlet,
    SidebarModule,
  ],
  templateUrl: './layout.component.html',
  styles: `
  .w-0 {
    width: 0%;
  }
  `
})
export default class DashboardComponent {
  public layoutService = inject(LayoutService);
  public usersService = inject(CustomersService)
  public sidebarVisible: boolean = true
}
