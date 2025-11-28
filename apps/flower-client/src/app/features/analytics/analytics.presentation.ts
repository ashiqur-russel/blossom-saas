import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/ui/components/card/card.component';
import { ChartComponent } from '../../shared/ui/components/chart/chart.component';
import { LoadingComponent } from '../../shared/ui/components/loading/loading.component';
import { ChartService } from '../../shared/ui/services/chart.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { IWeek, IWeekSummary } from '../../shared/models/week.model';

@Component({
  selector: 'app-analytics-presentation',
  standalone: true,
  imports: [CommonModule, CardComponent, ChartComponent, LoadingComponent],
  templateUrl: './analytics.presentation.html',
  styleUrl: './analytics.presentation.scss',
})
export class AnalyticsPresentationComponent {
  @Input() weeks: IWeek[] = [];
  @Input() summary: IWeekSummary | null = null;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() avgPriceTrendsData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  @Input() priceComparisonData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  @Input() profitMarginData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  @Input() revenueProfitTrendsData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  @Input() weeklyVolumeData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  @Input() salesByDayData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  chartService = new ChartService();

  getAverageBuyingPrice(): number {
    if (this.weeks.length === 0) return 0;
    const sum = this.weeks.reduce((acc, w) => acc + w.avgBuyingPrice, 0);
    return Math.round((sum / this.weeks.length) * 100) / 100;
  }

  getAverageSalesPrice(): number {
    if (this.weeks.length === 0) return 0;
    const sum = this.weeks.reduce((acc, w) => acc + w.avgSalesPrice, 0);
    return Math.round((sum / this.weeks.length) * 100) / 100;
  }

  getAverageProfitMargin(): number {
    if (this.weeks.length === 0) return 0;
    const sum = this.weeks.reduce((acc, w) => acc + (w.avgSalesPrice - w.avgBuyingPrice), 0);
    return Math.round((sum / this.weeks.length) * 100) / 100;
  }

  getProfitMarginPercentage(): number {
    const avgBuying = this.getAverageBuyingPrice();
    if (avgBuying === 0) return 0;
    const margin = this.getAverageProfitMargin();
    return Math.round((margin / avgBuying) * 100 * 10) / 10;
  }

  getPriceChartOptions(): ChartOptions<'line'> {
    const baseOptions = this.chartService.getLineChartOptions();
    return {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed['y'] ?? 0;
              return `${context.dataset.label}: €${value.toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        ...baseOptions.scales,
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              const numValue = Number(value);
              return isNaN(numValue) ? '€0.00' : `€${numValue.toFixed(2)}`;
            },
            font: {
              size: 11,
            },
          },
        },
        x: baseOptions.scales?.['x'],
      },
    };
  }

  getBarChartOptions(): ChartOptions<'bar'> {
    const baseOptions = this.chartService.getBarChartOptions();
    return {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed['y'] ?? 0;
              if (context.datasetIndex === 0 && this.weeklyVolumeData.datasets[0]?.label === 'Flowers (Units)') {
                return `${context.dataset.label}: ${value} units`;
              }
              return `${context.dataset.label}: €${value.toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        ...baseOptions.scales,
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              const numValue = Number(value);
              if (isNaN(numValue)) return '0';
              if (this.weeklyVolumeData.datasets[0]?.label === 'Flowers (Units)') {
                return `${numValue}`;
              }
              return `€${numValue.toFixed(0)}`;
            },
            font: {
              size: 11,
            },
          },
        },
        x: baseOptions.scales?.['x'],
      },
    };
  }

  getRevenueChartOptions(): ChartOptions<'line'> {
    const baseOptions = this.chartService.getLineChartOptions();
    return {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed['y'] ?? 0;
              return `${context.dataset.label}: €${value.toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        ...baseOptions.scales,
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              const numValue = Number(value);
              return isNaN(numValue) ? '€0' : `€${numValue.toFixed(0)}`;
            },
            font: {
              size: 11,
            },
          },
        },
        x: baseOptions.scales?.['x'],
      },
    };
  }
}
