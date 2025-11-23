import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, HostListener } from '@angular/core';
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
export class ChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() type: 'line' | 'bar' | 'pie' = 'line';
  @Input() data: any = { labels: [], datasets: [] };
  @Input() options: any = {};

  chartData: any = { labels: [], datasets: [] };
  chartOptions: any = {};
  private resizeTimeout: any;

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['options']) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.updateChart();
    }, 150);
  }

  private updateChart(): void {
    this.chartData = this.data;
    this.chartOptions = {
      ...this.options,
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 0,
      interaction: {
        intersect: false,
        mode: 'index' as const,
      },
    };
  }
}
