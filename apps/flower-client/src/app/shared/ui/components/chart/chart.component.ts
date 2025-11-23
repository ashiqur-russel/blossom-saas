import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() type: 'line' | 'bar' = 'line';
  @Input() data: ChartConfiguration<'line'>['data'] | ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  @Input() options: ChartOptions<'line'> | ChartOptions<'bar'> = {};

  chartData: ChartConfiguration<'line'>['data'] | ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartOptions<'line'> | ChartOptions<'bar'> = {};

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['options']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    this.chartData = this.data;
    this.chartOptions = {
      ...this.options,
      responsive: true,
      maintainAspectRatio: false,
    };
  }
}

