import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeekService, SummaryService } from '../weeks';
import { IWeek, IWeekSummary } from '../../shared/models/week.model';
import { ChartService } from '../../shared/ui/services/chart.service';
import { ChartConfiguration } from 'chart.js';
import { AnalyticsPresentationComponent } from './analytics.presentation';
import { ChartThemeColors } from '../../shared/utils/theme-colors.util';

@Component({
  selector: 'app-analytics-container',
  standalone: true,
  imports: [CommonModule, AnalyticsPresentationComponent],
  templateUrl: './analytics.container.html',
  styleUrl: './analytics.container.scss',
})
export class AnalyticsContainerComponent implements OnInit {
  weeks: IWeek[] = [];
  summary: IWeekSummary | null = null;
  loading = false;
  error: string | null = null;

  avgPriceTrendsData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  priceComparisonData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  profitMarginData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  revenueProfitTrendsData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  weeklyVolumeData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  salesByDayData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  constructor(
    private weekService: WeekService,
    private summaryService: SummaryService,
    private chartService: ChartService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.weekService.getAll().subscribe({
      next: (weeks: IWeek[]) => {
        this.weeks = weeks;
        this.prepareChartData();
        this.loadSummary();
      },
      error: (err: any) => {
        this.error = 'Failed to load analytics data';
        this.loading = false;
        console.error('Error loading weeks:', err);
      },
    });
  }

  loadSummary(): void {
    this.summaryService.getSummary().subscribe({
      next: (summary) => {
        this.summary = summary;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading summary:', err);
        this.loading = false;
      },
    });
  }

  prepareChartData(): void {
    if (this.weeks.length === 0) {
      return;
    }

    const sortedWeeks = [...this.weeks].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.weekNumber - b.weekNumber;
    });

    const labels = sortedWeeks.map((w) => `W${w.weekNumber}/${w.year}`);
    const shortLabels = sortedWeeks.map((w) => `W${w.weekNumber}`);

    const avgBuyingPrices = sortedWeeks.map((w) => Math.round(w.avgBuyingPrice * 100) / 100);
    const avgSalesPrices = sortedWeeks.map((w) => Math.round(w.avgSalesPrice * 100) / 100);
    const profits = sortedWeeks.map((w) => w.profit);
    const revenues = sortedWeeks.map((w) => w.revenue);
    const totalFlowers = sortedWeeks.map((w) => w.totalFlower);
    const profitMargins = sortedWeeks.map((w) => Math.round((w.avgSalesPrice - w.avgBuyingPrice) * 100) / 100);

    const thursdaySales = sortedWeeks.map((w) => w.sale?.thursday || 0);
    const fridaySales = sortedWeeks.map((w) => w.sale?.friday || 0);
    const saturdaySales = sortedWeeks.map((w) => w.sale?.saturday || 0);

    this.avgPriceTrendsData = {
      labels,
      datasets: [
        {
          label: 'Avg Buying Price per Unit',
          data: avgBuyingPrices,
          borderColor: ChartThemeColors.destructive(),
          backgroundColor: ChartThemeColors.destructiveLight(0.1),
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Avg Sales Price per Unit',
          data: avgSalesPrices,
          borderColor: ChartThemeColors.success(),
          backgroundColor: ChartThemeColors.successLight(0.1),
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };

    this.priceComparisonData = {
      labels: shortLabels,
      datasets: [
        {
          label: 'Avg Buying Price',
          data: avgBuyingPrices,
          backgroundColor: ChartThemeColors.destructiveMedium(0.8),
          borderColor: ChartThemeColors.destructive(),
          borderWidth: 1,
        },
        {
          label: 'Avg Sales Price',
          data: avgSalesPrices,
          backgroundColor: ChartThemeColors.successMedium(0.8),
          borderColor: ChartThemeColors.success(),
          borderWidth: 1,
        },
      ],
    };

    this.profitMarginData = {
      labels,
      datasets: [
        {
          label: 'Profit Margin per Unit (€)',
          data: profitMargins,
          borderColor: ChartThemeColors.kpiBlue(),
          backgroundColor: ChartThemeColors.kpiBlueLight(0.1),
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };

    this.revenueProfitTrendsData = {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: revenues,
          borderColor: ChartThemeColors.kpiPurple(),
          backgroundColor: ChartThemeColors.kpiPurpleLight(0.1),
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 4,
        },
        {
          label: 'Profit',
          data: profits,
          borderColor: ChartThemeColors.success(),
          backgroundColor: ChartThemeColors.successLight(0.1),
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 4,
        },
      ],
    };

    this.weeklyVolumeData = {
      labels: shortLabels,
      datasets: [
        {
          label: 'Flowers (Units)',
          data: totalFlowers,
          backgroundColor: ChartThemeColors.kpiOrangeMedium(0.8),
          borderColor: ChartThemeColors.kpiOrange(),
          borderWidth: 1,
        },
      ],
    };

    this.salesByDayData = {
      labels: shortLabels,
      datasets: [
        {
          label: 'Thursday Sales',
          data: thursdaySales,
          backgroundColor: ChartThemeColors.destructiveMedium(0.8),
          borderColor: ChartThemeColors.destructive(),
          borderWidth: 1,
        },
        {
          label: 'Friday Sales',
          data: fridaySales,
          backgroundColor: ChartThemeColors.kpiBlueMedium(0.8),
          borderColor: ChartThemeColors.kpiBlue(),
          borderWidth: 1,
        },
        {
          label: 'Saturday Sales',
          data: saturdaySales,
          backgroundColor: ChartThemeColors.successMedium(0.8),
          borderColor: ChartThemeColors.success(),
          borderWidth: 1,
        },
      ],
    };
  }
}

