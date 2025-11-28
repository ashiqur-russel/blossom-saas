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
    // Use data directly - don't deep clone as it can break Chart.js structure
    this.chartData = this.data && Object.keys(this.data).length > 0 
      ? { ...this.data } 
      : { labels: [], datasets: [] };
    
    // Merge options properly
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 0,
      animation: {
        duration: 0,
      },
      backgroundColor: 'transparent',
      color: '#2d1b2e',
      interaction: {
        intersect: false,
        mode: 'index' as const,
      },
      elements: {
        point: {
          radius: 3,
          hoverRadius: 5,
        },
      },
      layout: {
        padding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        },
      },
    };
    
    this.chartOptions = {
      ...defaultOptions,
      ...this.options,
    };
  }
}
