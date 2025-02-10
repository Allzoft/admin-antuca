import { Component, inject, type OnInit } from '@angular/core';
import { LayoutService } from '@services/layout.service';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-settings',
  imports: [ImageModule, ButtonModule, TagModule, ToggleSwitchModule],
  templateUrl: './settings.component.html',
})
export default class SettingsComponent implements OnInit {
  public layoutService = inject(LayoutService);

  ngOnInit(): void {}
}
