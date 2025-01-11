import { Component, inject, type OnInit } from '@angular/core';
import { LayoutService } from '@services/layout.service';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ImageModule, ButtonModule, TagModule],
  templateUrl: './settings.component.html',
})
export default class SettingsComponent implements OnInit {
  public layoutService = inject(LayoutService)

  ngOnInit(): void { }

}
