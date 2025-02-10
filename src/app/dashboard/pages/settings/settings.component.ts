import { Component, inject, ViewChild, type OnInit } from '@angular/core';
import { LayoutService } from '@services/layout.service';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Popover, PopoverModule } from 'primeng/popover';
import { RestaurantsService } from '@services/restaurants.service';
import { Restaurant, TypeSubscription } from '@interfaces/restaurant';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ThemeService } from '@services/theme.service';
import { $dt } from '@primeng/themes';
import { FormsModule } from '@angular/forms';
import { UploadService } from '@services/upload.service';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { environment } from '@environment/environment';

@Component({
  selector: 'app-settings',
  imports: [
    ImageModule,
    ButtonModule,
    TagModule,
    ToggleSwitchModule,
    ToastModule,
    PopoverModule,
    FormsModule,
    FileUploadModule,
    InputTextModule,
  ],
  templateUrl: './settings.component.html',
  providers: [MessageService],
})
export default class SettingsComponent implements OnInit {
  @ViewChild('op') op!: Popover;

  public messageService = inject(MessageService);
  public restaurantsService = inject(RestaurantsService);
  public layoutService = inject(LayoutService);
  public themeService = inject(ThemeService);
  public uploadService = inject(UploadService);

  public loadingRestaurant: boolean = false;
  public selectedPalette: 'primary' | 'secondary' = 'primary';

  public restaurant: Restaurant = {
    id_restaurant: 0,
    address: '',
    allow_notifications: 0,
    category: '',
    code_country: '',
    is_enabled: 1,
    logo_image: '',
    max_capacity: 0,
    name: '',
    owner: '',
    owner_phone: '',
    phone_number: '',
    primary_color: '',
    secondary_color: '',
    schedule: '',
    subscription: TypeSubscription.BASIC,
    type_cuisine: '',
  };

  public isEditingMainInfo: boolean = false;

  ngOnInit(): void {
    this.loadingRestaurant = true;
    this.restaurantsService.getOneByUser().subscribe((res) => {
      this.restaurant = res;
      console.log(res);
    });
  }

  public saveMainInfo() {
    const updateRestaurant: Partial<Restaurant> = {
      name: this.restaurant.name,
      logo_image: this.restaurant.logo_image,
    };
    this.restaurantsService.updateByUser(updateRestaurant).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Actualizacion exitosa',
        detail: '¡La actualización del restaurante se realizó correctamente!',
      });

      this.isEditingMainInfo = false;
      this.restaurant.name = res.name;
      this.restaurant.logo_image = res.logo_image;
    });
  }

  public selectPalette(palette: 'primary' | 'secondary') {
    this.selectedPalette = palette;
  }

  public updateThemeColor(color: string) {
    const updateRestaurant: Partial<Restaurant> = {
      [`${this.selectedPalette}_color`]: color,
    };

    this.restaurantsService.updateByUser(updateRestaurant).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Actualizacion exitosa',
        detail: '¡La actualización del tema se realizó correctamente!',
      });
      this.restaurant[`${this.selectedPalette}_color`] =
        res[`${this.selectedPalette}_color`];
      this.themeService.changeThemeColors(this.selectedPalette, color);
      this.op.toggle(event);
    });
  }

  public onUpload(event: any) {
    console.log(event);

    if (event.files.length > 0) {
      const file = event.files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.uploadService.uploadfile(formData).subscribe((res) => {
        console.log(res);
        this.restaurant.logo_image =
          environment.url_public + '/uploads/' + res['filename'];
      });
    }
  }
}
