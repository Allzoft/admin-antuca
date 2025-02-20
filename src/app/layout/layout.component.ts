import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '@services/layout.service';
import { SidemenuComponent } from '@shared/sidemenu/sidemenu.component';
import { TopbarComponent } from '@shared/topbar/topbar.component';
import { CustomersService } from '@services/customers.service';
import { DrawerModule } from 'primeng/drawer';
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    SidemenuComponent,
    DrawerModule,
    TopbarComponent,
    RouterOutlet,
  ],
  templateUrl: './layout.component.html',
})
export default class DashboardComponent {
  public layoutService = inject(LayoutService);
  public themeService = inject(ThemeService)
  public usersService = inject(CustomersService);

  public restaurant = this.usersService.restaurant

  public isDarkMode = this.themeService.isDarkMode
}
