import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeekService } from '../weeks';
import { IWeek } from '../../shared/models/week.model';
import { ChartService } from '../../shared/ui/services/chart.service';
import { ChartConfiguration } from 'chart.js';
import { AnalyticsPresentationComponent } from './analytics.presentation';

@Component({
  selector: 'app-analytics-container',
  standalone: true,
  imports: [CommonModule, AnalyticsPresentationComponent],
  templateUrl: './analytics.container.html',
  styleUrl: './analytics.container.scss',
})
export class AnalyticsContainerComponent implements OnInit {
  weeks: IWeek[] = [];
  loading = false;
  error: string | null = null;

  avgPriceTrendsData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  priceComparisonData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  priceDistributionData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  constructor(
    private weekService: WeekService,
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
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load analytics data';
        this.loading = false;
        console.error('Error loading weeks:', err);
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

    const labels = sortedWeeks.map(
      (w) => `Week ${w.weekNumber}, ${w.year}`,
    );

    const avgBuyingPrices = sortedWeeks.map((w) => Math.round(w.avgBuyingPrice * 100) / 100);
    const avgSalesPrices = sortedWeeks.map((w) => Math.round(w.avgSalesPrice * 100) / 100);

    this.avgPriceTrendsData = {
      labels,
      datasets: [
        {
          label: 'Avg Buying Price',
          data: avgBuyingPrices,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Avg Sales Price',
          data: avgSalesPrices,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };

    this.priceComparisonData = {
      labels,
      datasets: [
        {
          label: 'Avg Buying Price',
          data: avgBuyingPrices,
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
        },
        {
          label: 'Avg Sales Price',
          data: avgSalesPrices,
          backgroundColor: 'rgba(34, 197, 94, 0.7)',
        },
      ],
    };

    const profitMargins = sortedWeeks.map(
      (w) => w.avgSalesPrice - w.avgBuyingPrice,
    );

    this.priceDistributionData = {
      labels,
      datasets: [
        {
          label: 'Profit Margin per Unit',
          data: profitMargins,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }
}

