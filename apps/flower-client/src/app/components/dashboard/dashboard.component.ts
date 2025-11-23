import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlowerBusinessService, FlowerWeekDTO, FlowerWeekSummaryDTO } from '../../services/flower-business.service';
import { ChartConfiguration, ChartOptions, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  weeks: FlowerWeekDTO[] = [];
  summary: FlowerWeekSummaryDTO | null = null;
  loading = false;
  error: string | null = null;

  // Chart data
  profitChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      label: 'Profit',
      data: [],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };

  salesChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Thursday', 'Friday', 'Saturday'],
    datasets: []
  };

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        type: 'linear',
      },
    },
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        type: 'linear',
      },
    },
  };

  constructor(private flowerService: FlowerBusinessService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.flowerService.getAllWeeks().subscribe({
      next: (weeks) => {
        this.weeks = weeks;
        this.updateCharts();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load weeks';
        this.loading = false;
        console.error(err);
      },
    });

    this.flowerService.getSummary().subscribe({
      next: (summary) => {
        this.summary = summary;
      },
      error: (err) => {
        console.error('Failed to load summary', err);
      },
    });
  }

  updateCharts(): void {
    if (!this.weeks || this.weeks.length === 0) {
      this.profitChartData = {
        labels: [],
        datasets: [{
          label: 'Profit (€)',
          data: [],
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          fill: true,
        }]
      };
      this.salesChartData = {
        labels: ['Thursday', 'Friday', 'Saturday'],
        datasets: []
      };
      return;
    }

    // Profit chart
    const sortedWeeks = [...this.weeks].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.weekNumber - b.weekNumber;
    });

    this.profitChartData = {
      labels: sortedWeeks.map(w => `W${w.weekNumber}/${w.year}`),
      datasets: [{
        label: 'Profit (€)',
        data: sortedWeeks.map(w => Number(w.profit) || 0),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      }]
    };

    // Sales by day chart - only show weeks that have sale data
    const weeksWithSales = sortedWeeks.filter(w => w.sale);
    const last4Weeks = weeksWithSales.slice(-4);
    
    if (last4Weeks.length > 0) {
      this.salesChartData = {
        labels: ['Thursday', 'Friday', 'Saturday'],
        datasets: last4Weeks.map((week, index) => {
          const sale = week.sale || { thursday: 0, friday: 0, saturday: 0 };
          return {
            label: `Week ${week.weekNumber}`,
            data: [
              Number(sale.thursday) || 0,
              Number(sale.friday) || 0,
              Number(sale.saturday) || 0
            ],
            backgroundColor: `rgba(${59 + index * 20}, ${130 + index * 30}, ${246 - index * 20}, 0.7)`,
          };
        })
      };
    } else {
      this.salesChartData = {
        labels: ['Thursday', 'Friday', 'Saturday'],
        datasets: []
      };
    }
  }

  deleteWeek(id: string): void {
    if (confirm('Are you sure you want to delete this week?')) {
      // Store the week being deleted for rollback if needed
      const weekToDelete = this.weeks.find(w => w.id === id);
      
      // Optimistically remove from UI immediately
      this.weeks = this.weeks.filter(w => w.id !== id);
      this.updateCharts();
      
      // Update summary immediately
      if (this.summary && weekToDelete) {
        this.summary.totalWeeks = Math.max(0, (this.summary.totalWeeks || 1) - 1);
        this.summary.totalProfit = (this.summary.totalProfit || 0) - (weekToDelete.profit || 0);
        this.summary.totalSales = (this.summary.totalSales || 0) - (weekToDelete.totalSale || 0);
        this.summary.totalFlowers = (this.summary.totalFlowers || 0) - (weekToDelete.totalFlower || 0);
        this.summary.totalSavings = (this.summary.totalSavings || 0) - (weekToDelete.savings || 0);
        if (this.summary.totalWeeks > 0) {
          this.summary.averageProfit = this.summary.totalProfit / this.summary.totalWeeks;
          this.summary.averageFlowers = this.summary.totalFlowers / this.summary.totalWeeks;
        } else {
          this.summary.averageProfit = 0;
          this.summary.averageFlowers = 0;
        }
      }
      
      // Then delete from server and reload to ensure consistency
      this.flowerService.deleteWeek(id).subscribe({
        next: () => {
          // Reload all data to ensure consistency with server
          this.loadData();
        },
        error: (err) => {
          // If delete fails, reload to restore correct state
          this.error = 'Failed to delete week: ' + (err.error?.message || err.message || 'Unknown error');
          console.error('Delete error:', err);
          // Reload to restore correct state
          this.loadData();
        },
      });
    }
  }

  getProfitColor(profit: number): string {
    if (profit > 0) return 'text-green-600';
    if (profit < 0) return 'text-red-600';
    return 'text-gray-600';
  }

  getProfitBgColor(profit: number): string {
    if (profit > 0) return 'bg-green-50 border-green-200';
    if (profit < 0) return 'bg-red-50 border-red-200';
    return 'bg-gray-50 border-gray-200';
  }
}
