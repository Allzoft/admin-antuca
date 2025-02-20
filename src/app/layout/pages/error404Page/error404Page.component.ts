import { Component, inject, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '@services/layout.service';
import { ThemeService } from '@services/theme.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error-404-page',
  imports: [ButtonModule],
  templateUrl: './Error404Page.component.html',
})
export default class Error404PageComponent implements OnInit {
  private themeService = inject(ThemeService);
  public layoutService = inject(LayoutService)
  public router = inject(Router)

  public isDarkMode = this.themeService.isDarkMode;

  ngOnInit(): void {
  }
}
