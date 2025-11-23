import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ChartService } from '../../../../shared/ui/services/chart.service';
import { WeekService } from '../../../weeks/services/week.service';
import { IWeek, IWeekSummary } from '../../../../shared/models/week.model';
import { IWithdrawalSummary } from '../../../withdrawals/services/withdrawal.service';
import { ChartConfiguration } from 'chart.js';
import { DashboardPresentationComponent } from '../dashboard-presentation/dashboard-presentation.component';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardPresentationComponent],
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.scss',
})
export class DashboardContainerComponent implements OnInit {
  weeks: IWeek[] = [];
  summary: IWeekSummary | null = null;
  withdrawalSummary: IWithdrawalSummary | null = null;
  loading = false;
  error: string | null = null;

  profitChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  salesChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  revenueProfitTrendsData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  profitSavingsBarData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  salesByDayPieData: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
  dailySalesTrendsData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  currentWeek: IWeek | null = null;
  activeTab: 'weekly' | 'trends' = 'weekly';

  constructor(
    private dashboardService: DashboardService,
    private chartService: ChartService,
    private weekService: WeekService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.loadDashboardData().subscribe({
      next: ({ weeks, summary, withdrawalSummary }) => {
        this.weeks = weeks;
        this.summary = summary;
        this.withdrawalSummary = withdrawalSummary;
        this.updateCharts();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data';
        this.loading = false;
        console.error(err);
      },
    });
  }

  updateCharts(): void {
    this.profitChartData = this.chartService.createProfitChartData(this.weeks);
    this.salesChartData = this.chartService.getSalesChartData(this.weeks);
    this.revenueProfitTrendsData = this.chartService.createRevenueProfitTrendsData(this.weeks);
    this.profitSavingsBarData = this.chartService.createProfitSavingsBarData(this.weeks);
    this.dailySalesTrendsData = this.chartService.createDailySalesTrendsData(this.weeks);
    
    const sortedWeeks = [...this.weeks].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.weekNumber - a.weekNumber;
    });
    this.currentWeek = sortedWeeks.length > 0 ? sortedWeeks[0] : null;
    this.salesByDayPieData = this.chartService.createSalesByDayPieData(this.currentWeek);
  }

  setActiveTab(tab: 'weekly' | 'trends'): void {
    this.activeTab = tab;
  }

  deleteWeek(id: string): void {
    if (confirm('Are you sure you want to delete this week?')) {
      this.weekService.delete(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => {
          this.error = 'Failed to delete week';
          console.error(err);
        },
      });
    }
  }

  onWeekAdded(): void {
    this.loadData();
  }

  onWeekUpdated(): void {
    this.loadData();
  }

  onEditCancelled(): void {
    // Form will reset itself
  }

  editWeek(week: IWeek): void {
    // This will be handled by the presentation component
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

