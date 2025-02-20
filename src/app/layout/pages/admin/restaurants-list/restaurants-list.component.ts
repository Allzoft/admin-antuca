import { Component, inject, type OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { SidebarModule } from 'primeng/sidebar';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LayoutService } from '@services/layout.service';
import { RestaurantsService } from '@services/restaurants.service';
import { UploadService } from '@services/upload.service';
import { Restaurant, TypeSubscription } from '@interfaces/restaurant';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DrawerModule } from 'primeng/drawer';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { environment } from '@environment/environment';
import { PipesModule } from '../../../../pipes/pipes.module';

@Component({
  selector: 'app-restaurants-list',
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    InputTextModule,
    FormsModule,
    PipesModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    DropdownModule,
    RouterModule,
    InputSwitchModule,
    InputNumberModule,
    FileUploadModule,
    TagModule,
    DrawerModule,
    InputIconModule,
    IconFieldModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './restaurants-list.component.html',
})
export default class RestaurantsListComponent implements OnInit {
  public layoutService = inject(LayoutService);
  private restaurantsService = inject(RestaurantsService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  public router = inject(Router);
  public showRestaurantForm: boolean = false;
  public uploadService = inject(UploadService);

  public restaurants = this.restaurantsService.restaurants;
  public loading = this.restaurantsService.loading;
  public subscriptionArray: string[] = Object.values(TypeSubscription);

  public restaurant: Restaurant = {
    id_restaurant: 0,
    name: '',
    logo_image: '',
    is_enabled: 0,
    phone_number: '',
    code_country: '',
    address: '',
    owner: '',
    owner_phone: '',
    category: '',
    max_capacity: 0,
    schedule: '',
    subscription: TypeSubscription.BASIC,
    type_cuisine: '',
    primary_color: '',
    secondary_color: '',
    allow_notifications: 0,
  };

  public restaurantFormDirt = {
    name: false,
    lastname: false,
    phone: false,
    email: false,
    role: false,
  };

  ngOnInit(): void {
    this.restaurantsService.getRestaurants();
  }

  public onUpload(event: any) {
    console.log(event);

    if (event.files.length > 0) {
      const file = event.files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.uploadService.uploadfile(formData).subscribe((res) => {
        console.log(res);
        this.restaurant.logo_image = environment.url_public + '/uploads/' + res['filename'];
      });
    }
  }

  public optionsCodeCountries: { flag: string; code: string }[] = [
    {
      flag: 'https://www.worldstatesmen.org/bo_s.gif',
      code: '+591',
    },
  ];

  public selectedCodeCountry: { flag: string; code: string } = {
    flag: 'https://www.worldstatesmen.org/bo_s.gif',
    code: '+591',
  };

  public removeRestaurant(restaurant: Restaurant) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar este restaurante?',
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-rounded p-button-success w-28',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-warning w-28',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.restaurantsService
          .deleteRestaurant(restaurant.id_restaurant)
          .subscribe((_) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminación exitosa',
              detail: `Usuario eliminado exitosamente`,
            });
          });
      },
    });
  }

  public editRestaurant(restaurant: Restaurant): void {
    this.restaurant = restaurant;
    const selectedCountry = this.optionsCodeCountries.find(
      (o) => o.code === restaurant.code_country
    );
    this.showRestaurantForm = true;
  }

  public createRestaurant(): void {
    this.showRestaurantForm = true;
    this.restaurant = {
      id_restaurant: 0,
      name: '',
      logo_image: '',
      is_enabled: 0,
      phone_number: '',
      code_country: '',
      address: '',
      owner: '',
      owner_phone: '',
      category: '',
      max_capacity: 0,
      schedule: '',
      subscription: TypeSubscription.BASIC,
      type_cuisine: '',
      primary_color: '',
      secondary_color: '',
      allow_notifications: 0,
    };
  }

  public async saveRestaurant() {
    if (!(await this.passItemForm())) return;

    const newRestaurant: Partial<Restaurant> = {
      name: this.restaurant.name,
      logo_image: this.restaurant.logo_image,
      is_enabled: this.restaurant.is_enabled,
      phone_number: this.restaurant.phone_number,
      code_country: this.restaurant.code_country,
      address: this.restaurant.address,
      owner: this.restaurant.owner,
      owner_phone: this.restaurant.owner_phone,
      category: this.restaurant.category,
      max_capacity: this.restaurant.max_capacity,
      schedule: this.restaurant.schedule,
      subscription: this.restaurant.subscription,
      type_cuisine: this.restaurant.type_cuisine,
      primary_color: this.restaurant.primary_color,
      secondary_color: this.restaurant.secondary_color,
      allow_notifications: this.restaurant.allow_notifications,
    };

    if (this.restaurant.id_restaurant === 0) {
      this.restaurantsService
        .postRestaurant(newRestaurant)
        .subscribe((resItem) => {
          console.log(resItem);
          this.messageService.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'El restaurante se creo exitosamente',
          });
          this.showRestaurantForm = false;
        });
    } else {
      this.restaurantsService
        .updateRestaurant(this.restaurant.id_restaurant, newRestaurant)
        .subscribe((resItem) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'El restaurante se actualizo exitosamente',
          });
          this.showRestaurantForm = false;
        });
    }
  }
  private passItemForm(): Promise<boolean> {
    if (!this.restaurant.name) {
      this.restaurantFormDirt.name = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'En este formulario el nombre es obligatorio',
      });
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  }
}
