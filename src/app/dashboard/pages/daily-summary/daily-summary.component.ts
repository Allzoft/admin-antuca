import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Signal,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from '@services/layout.service';
import { ToastModule } from 'primeng/toast';
import { PipesModule } from '../../../pipes/pipes.module';
import { SkeletonModule } from 'primeng/skeleton';
import {
  SelectButtonChangeEvent,
  SelectButtonModule,
} from 'primeng/selectbutton';
import { MeterGroup, MeterGroupModule } from 'primeng/metergroup';
import { ChartModule } from 'primeng/chart';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { ChartData } from 'chart.js';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReportsService } from '@services/reports.service';
import { Router } from '@angular/router';
import { DatePickerModule } from 'primeng/datepicker';

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
    DatePickerModule,
    SelectButtonModule,
    ChartModule,
    ProgressSpinnerModule,
    ToastModule,
    MeterGroupModule,
    DropdownModule,
    PipesModule,
  ],
  providers: [MessageService],
  templateUrl: './daily-summary.component.html',
})
export default class DailySummaryComponent implements OnInit {
  @ViewChild('mg') mg!: MeterGroup;

  public layoutService = inject(LayoutService);
  private messageService = inject(MessageService);
  public reportsService = inject(ReportsService);
  public router = inject(Router);

  public dailyReport = this.reportsService.dailyReport;
  public loadingDailyReport = this.reportsService.loadingDailyReport;

  public ordersSummary = this.reportsService.ordersSummary;
  public loadingOrdersSummary = this.reportsService.loadingOrdersSummary;

  public financialSummary = this.reportsService.financialSummary;
  public loadingFinancialSummary = this.reportsService.loadingFinancialSummary;

  public newClientsSummary = this.reportsService.newClientsSummary;
  public loadingNewClientsSummary = this.reportsService.loadingNewClients;

  public filterDate: Date = new Date();

  public stateOptionsOrdersSummary: { label: string; value: string }[] = [
    { label: 'Mensual', value: 'monthly' },
    { label: 'Semanal', value: 'weekly' },
    { label: 'Hoy', value: 'daily' },
  ];

  public valueOrdersSummary: { label: string; value: string } = {
    label: 'Hoy',
    value: 'daily',
  };

  public stateOptionsNewClients: { label: string; value: string }[] = [
    { label: 'Mensual', value: 'monthly' },
    { label: 'Semanal', value: 'weekly' },
    { label: 'Hoy', value: 'daily' },
  ];

  public valueNewClients: { label: string; value: string } = {
    label: 'Hoy',
    value: 'daily',
  };

  public dateIncomeOptions: string[] = ['Mensual', 'Semanal', 'Hoy'];
  public dateIncomeSelected: string = 'Hoy';

  public loadingOrders(): boolean {
    return false;
  }

  documentStyle = getComputedStyle(document.documentElement);
  textColor = this.documentStyle.getPropertyValue('--p-text-color');

  get valueMeter() {
    const summary = this.ordersSummary();

    // Si summary es nulo o undefined, devolvemos 0 para todos los puntos.
    if (!summary) {
      return [
        {
          label: 'En sala',
          value: 0,
          color: this.documentStyle.getPropertyValue('--p-primary-500'),
        },
        {
          label: 'Delivery',
          value: 0,
          color: this.documentStyle.getPropertyValue('--p-gray-300'),
        },
        {
          label: 'Para llevar',
          value: 0,
          color: this.documentStyle.getPropertyValue('--p-primary-700'),
        },
        {
          label: 'Mixto',
          value: 0,
          color: this.documentStyle.getPropertyValue('--p-secondary-400'),
        },
      ];
    }

    // Si summary tiene datos, se realizan los cálculos correspondientes.
    return [
      {
        label: 'En sala',
        value: (summary.orders_by_table * 100) / summary.total_orders,
        color: this.documentStyle.getPropertyValue('--p-primary-500'),
      },
      {
        label: 'Delivery',
        value: (summary.orders_by_delivery * 100) / summary.total_orders,
        color: this.documentStyle.getPropertyValue('--p-gray-300'),
      },
      {
        label: 'Para llevar',
        value: (summary.orders_by_pickup * 100) / summary.total_orders,
        color: this.documentStyle.getPropertyValue('--p-primary-600'),
      },
      {
        label: 'Mixto',
        value: (summary.orders_by_mix * 100) / summary.total_orders,
        color: this.documentStyle.getPropertyValue('--p-secondary-400'),
      },
    ];
  }

  options: any;

  optionsBar: any;

  constructor() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--p-text-muted-color'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--p-xyaxis-500');

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
              return value === 0 ? '' : value.toFixed(2);
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

  public ngOnInit(): void {
    this.fetchOrders();
    this.fetchOrdersByServiceMode();
    this.fetchIncomesByPeriods();
    this.fetchNewClients();
  }

  public fetchOrders(): void {
    this.reportsService.getDailyReport(this.filterDate, this.filterDate);
  }

  public onSelectOrdersChange(event: SelectButtonChangeEvent) {
    console.log(event);
    this.fetchOrdersByServiceMode();
  }

  public fetchOrdersByServiceMode(): void {
    const today = new Date();

    if (this.valueOrdersSummary.value === 'daily') {
      this.reportsService.getOrdersSummary(today, today);
    } else if (this.valueOrdersSummary.value === 'weekly') {
      let dayOfWeek = today.getDay();
      if (dayOfWeek === 0) {
        dayOfWeek = 7;
      }
      const monday = new Date(today);
      monday.setDate(today.getDate() - (dayOfWeek - 1));

      this.reportsService.getOrdersSummary(monday, today);
    } else if (this.valueOrdersSummary.value === 'monthly') {
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      this.reportsService.getOrdersSummary(firstDayOfMonth, today);
    }
  }

  public fetchIncomesByPeriods() {
    if (this.dateIncomeSelected === 'Hoy') {
      this.reportsService.getFinnacialSummary('daily');
    } else if (this.dateIncomeSelected === 'Semanal') {
      this.reportsService.getFinnacialSummary('weekly');
    } else if (this.dateIncomeSelected === 'Mensual') {
      this.reportsService.getFinnacialSummary('monthly');
    }
  }

  public fetchNewClients(): void {
    if (this.valueNewClients.value === 'daily') {
      this.reportsService.getNewClientsSummary('daily');
    } else if (this.valueNewClients.value === 'weekly') {
      this.reportsService.getNewClientsSummary('weekly');
    } else if (this.valueNewClients.value === 'monthly') {
      this.reportsService.getNewClientsSummary('monthly');
    }
  }

  public chartData = computed(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const primaryColor100 = documentStyle.getPropertyValue('--p-primary-900');
    const secondaryColor100 =
      documentStyle.getPropertyValue('--p-secondary-900');

    const financialSummary = this.reportsService.financialSummary();

    if (!financialSummary) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Ingresos',
            fill: {
              target: 'origin',
              above: this.hexToRgba(primaryColor100, 0.1),
              below: this.hexToRgba(primaryColor100, 0.1),
            },
            borderColor: documentStyle.getPropertyValue('--p-primary-400'),
            backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
            yAxisID: 'y',
            tension: 0.4,
            data: [],
            pointRadius: 1.5,
          },
          {
            label: 'Salidas',
            fill: {
              target: 'origin',
              above: this.hexToRgba(secondaryColor100, 0.1),
              below: this.hexToRgba(secondaryColor100, 0.1),
            },
            borderColor: documentStyle.getPropertyValue('--p-secondary-400'),
            backgroundColor:
              documentStyle.getPropertyValue('--p-secondary-400'),
            yAxisID: 'y1',
            tension: 0.4,
            data: [],
            pointRadius: 1.5,
          },
        ],
      };
    }

    return {
      labels: financialSummary.labels,
      datasets: [
        {
          label: 'Ingresos',
          fill: {
            target: 'origin',
            above: this.hexToRgba(primaryColor100, 0.1),
            below: this.hexToRgba(primaryColor100, 0.1),
          },
          borderColor: documentStyle.getPropertyValue('--p-primary-400'),
          backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
          yAxisID: 'y',
          tension: 0.4,
          data: financialSummary.incomes,
          pointRadius: 1.5,
        },
        {
          label: 'Salidas',
          fill: {
            target: 'origin',
            above: this.hexToRgba(secondaryColor100, 0.1),
            below: this.hexToRgba(secondaryColor100, 0.1),
          },
          borderColor: documentStyle.getPropertyValue('--p-secondary-400'),
          backgroundColor: documentStyle.getPropertyValue('--p-secondary-400'),
          yAxisID: 'y1',
          tension: 0.4,
          data: financialSummary.outcomes,
          pointRadius: 1.5,
        },
      ],
    };
  });

  public chartDataClients = computed(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const primaryColor400 = documentStyle.getPropertyValue('--p-primary-400');

    const clientsSummary = this.reportsService.newClientsSummary();

    console.log(clientsSummary);
    

    if (!clientsSummary) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Ingresos',
            borderColor: primaryColor400,
            backgroundColor: primaryColor400,
            data: [],
            categoryPercentage: 0.4,
            borderRadius: 5,
          },
        ],
      };
    }

    return {
      labels: clientsSummary.labels,
      datasets: [
        {
          label: 'Clientes',
          data: clientsSummary.clients_value,
          borderColor: primaryColor400,
          backgroundColor: primaryColor400,
          categoryPercentage: 0.4,
          borderRadius: 5,
        },
      ],
    };
  });

  private hexToRgba(hex: string, alpha: number): string {
    hex = hex.trim().replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
