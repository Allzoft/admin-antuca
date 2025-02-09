import { CommonModule } from '@angular/common';
import { Component, Signal, computed, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { OrdersService } from '@services/orders.service';
import { LayoutService } from '@services/layout.service';
import { Order } from '@interfaces/order';
import moment from 'moment';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Client } from '@interfaces/client';
import { ClientComponent } from '@shared/client/client.component';
import { ItemComponent } from '@shared/item/item.component';
import { Items } from '@interfaces/items';
import { OrderComponent } from '@shared/order/order.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { StatesService } from '../../../services/states.service';
import { State } from '@interfaces/state';
import { DailyAvailabilityServices } from '@services/dailyAvailability.service';
import { DailyAvailability } from '@interfaces/dailyAvailability';
import { PipesModule } from '../../../pipes/pipes.module';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MeterGroupModule } from 'primeng/metergroup';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { ChartData } from 'chart.js';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReportsService } from '@services/reports.service';

@Component({
    selector: 'app-daily-summary',
    imports: [
        CommonModule,
        FormsModule,
        CarouselModule,
        SkeletonModule,
        ButtonModule,
        TieredMenuModule,
        TagModule,
        CardModule,
        SelectButtonModule,
        CalendarModule,
        ChartModule,
        CalendarModule,
        ProgressSpinnerModule,
        ToastModule,
        MeterGroupModule,
        OverlayPanelModule,
        DropdownModule,
        PipesModule,
    ],
    providers: [MessageService],
    templateUrl: './daily-summary.component.html'
})
export default class DailySummaryComponent {
  public layoutService = inject(LayoutService);
  private messageService = inject(MessageService);
  private reportsService = inject(ReportsService);

  public dailyReport = this.reportsService.dailyReport;
  public loadingDailyReport = this.reportsService.loadingDailyReport;

  public filterDate: Date = new Date();

  public stateOptions: { label: string; value: string }[] = [
    { label: 'Mensual', value: '0' },
    { label: 'Semanal', value: '1' },
    { label: 'Hoy', value: '2' },
  ];

  value: { label: string; value: string } = { label: 'Hoy', value: '2' };

  public dateIncomeOptions: string[] = ['Mensual', 'Semanal', 'Hoy'];
  public dateIncomeSelected: string = 'Mensual';

  public loadingOrders(): boolean {
    return false;
  }

  public fetchOrders(): void {
    this.reportsService.getDailyReport(this.filterDate, this.filterDate);
  }

  documentStyle = getComputedStyle(document.documentElement);
  textColor = this.documentStyle.getPropertyValue('--p-text-color');

  valueMeter = [
    {
      label: 'En sala',
      value: 50,
      color: this.documentStyle.getPropertyValue('--p-yellow-400'),
    },
    {
      label: 'Delivery',
      value: 20,
      color: this.documentStyle.getPropertyValue('--p-bluegray-500'),
    },
    {
      label: 'Para llevar',
      value: 30,
      color: this.documentStyle.getPropertyValue('--p-primary-500'),
    },
  ];

  data: ChartData;

  options: any;

  dataBar: ChartData;
  optionsBar: any;

  constructor() {
    this.fetchOrders();

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--p-text-muted-color'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--p-xyaxis-500');

    this.data = {
      labels: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
      ],
      datasets: [
        {
          label: 'Ingresos',
          fill: {
            target: 'origin',

            above: 'rgba(239, 241, 106, 0.1)',
            below: 'rgba(255, 255, 102, 0.1)',
          },
          borderColor: documentStyle.getPropertyValue('--p-primary-300'),
          backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
          yAxisID: 'y',
          tension: 0.4,
          data: [
            24540, 16308, 16980, 15041, 21322, 24619, 22298, 22285, 21017,
            22613, 18149,
          ],
          pointRadius: 1.5,
        },
        {
          label: 'Salidas',
          fill: {
            target: 'origin',
            above: 'rgba(255, 165, 0, 0.1)',
            below: 'rgba(255, 184, 77, 0.1)',
          },
          borderColor: documentStyle.getPropertyValue('--p-secondary-400'),
          backgroundColor: documentStyle.getPropertyValue('--p-secondary-400'),
          yAxisID: 'y1',
          tension: 0.4,
          data: [
            19774, 19634, 22028, 17586, 16489, 22527, 15471, 23557, 24971,
            20838, 19575,
          ],
          pointRadius: 1.5,
        },
      ],
    };

    this.options = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: '',
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            count: 6,
            color: textColorSecondary,
            callback: function (value: number) {
              if (value >= 1000) {
                return value / 1000 + 'k';
              }
              return value;
            },
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y1: {
          display: false,
        },
      },
    };

    this.dataBar = {
      labels: [
        'Ene',
        'Feb',
        'Maz',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
      ],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
          borderColor: documentStyle.getPropertyValue('--p-primary-300'),
          data: [65, 59, 80, 81, 56, 55, 40, 15, 30, 21, 12],
          categoryPercentage: 0.4,
          borderRadius: 5,
        },
      ],
    };

    this.optionsBar = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            callback: function (value: number) {
              return value === 0 ? '' : value;
            },
            color: textColorSecondary,
            count: 4,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
            borderColor: 'transparent',
          },
        },
      },
    };
  }
}
