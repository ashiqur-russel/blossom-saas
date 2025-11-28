import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/ui/components/card/card.component';
import { ChartComponent } from '../../shared/ui/components/chart/chart.component';
import { ChartService } from '../../shared/ui/services/chart.service';
import { ChartConfiguration } from 'chart.js';
import { IWeek } from '../../shared/models/week.model';

@Component({
  selector: 'app-analytics-presentation',
  standalone: true,
  imports: [CommonModule, CardComponent, ChartComponent],
  templateUrl: './analytics.presentation.html',
  styleUrl: './analytics.presentation.scss',
})
export class AnalyticsPresentationComponent {
  @Input() weeks: IWeek[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() avgPriceTrendsData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  @Input() priceComparisonData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  @Input() priceDistributionData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  chartService = new ChartService();

  getAverageBuyingPrice(): number {
    if (this.weeks.length === 0) return 0;
    const sum = this.weeks.reduce((acc, w) => acc + w.avgBuyingPrice, 0);
    return sum / this.weeks.length;
  }

  getAverageSalesPrice(): number {
    if (this.weeks.length === 0) return 0;
    const sum = this.weeks.reduce((acc, w) => acc + w.avgSalesPrice, 0);
    return sum / this.weeks.length;
  }

  getAverageProfitMargin(): number {
    if (this.weeks.length === 0) return 0;
    const sum = this.weeks.reduce((acc, w) => acc + (w.avgSalesPrice - w.avgBuyingPrice), 0);
    return sum / this.weeks.length;
  }

  getProfitMarginPercentage(): number {
    const avgBuying = this.getAverageBuyingPrice();
    if (avgBuying === 0) return 0;
    const margin = this.getAverageProfitMargin();
    return (margin / avgBuying) * 100;
  }
}

