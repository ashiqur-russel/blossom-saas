import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { IWeek, IWeekSummary } from '../../shared/models/week.model';
import { IWithdrawalSummary } from '../../shared/models/withdrawal.model';
import { CardComponent } from '../../shared/ui/components/card/card.component';
import { ButtonComponent } from '../../shared/ui/components/button/button.component';
import { ChartComponent } from '../../shared/ui/components/chart/chart.component';
import { LoadingComponent } from '../../shared/ui/components/loading/loading.component';
import { ChartService } from '../../shared/ui/services/chart.service';
import { WeekCardComponent } from '../weeks';
import { SalesFormComponent } from './sales-form.component';

@Component({
  selector: 'app-dashboard-presentation',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, ChartComponent, DatePipe, SalesFormComponent, LoadingComponent],
  templateUrl: './dashboard.presentation.html',
  styleUrl: './dashboard.presentation.scss',
})
export class DashboardPresentationComponent {
  // Input signals
  weeks = input<IWeek[]>([]);
  summary = input<IWeekSummary | null>(null);
  withdrawalSummary = input<IWithdrawalSummary | null>(null);
  loading = input<boolean>(false);
  refreshing = input<boolean>(false);
  error = input<string | null>(null);
  profitChartData = input<ChartConfiguration<'line'>['data']>({ labels: [], datasets: [] });
  salesChartData = input<ChartConfiguration<'bar'>['data']>({ labels: [], datasets: [] });
  revenueProfitTrendsData = input<ChartConfiguration<'line'>['data']>({ labels: [], datasets: [] });
  profitSavingsBarData = input<ChartConfiguration<'bar'>['data']>({ labels: [], datasets: [] });
  salesByDayPieData = input<ChartConfiguration<'pie'>['data']>({ labels: [], datasets: [] });
  dailySalesTrendsData = input<ChartConfiguration<'line'>['data']>({ labels: [], datasets: [] });
  currentWeek = input<IWeek | null>(null);
  activeTab = input<'weekly' | 'trends'>('weekly');
  getProfitColor = input.required<(profit: number) => string>();
  getProfitBgColor = input.required<(profit: number) => string>();

  // Output signals
  deleteWeek = output<string>();
  setActiveTab = output<'weekly' | 'trends'>();
  weekAdded = output<void>();
  weekUpdated = output<void>();
  editCancelled = output<void>();

  selectedWeekForEdit = signal<IWeek | null>(null);

  chartService = new ChartService();

  // Computed signals
  averageSalesByDay = computed(() => {
    const weeksValue = this.weeks();
    if (!weeksValue || weeksValue.length === 0) {
      return { thursday: 0, friday: 0, saturday: 0 };
    }

    const totals = weeksValue.reduce((acc, week) => {
      const sale = week.sale || { thursday: 0, friday: 0, saturday: 0 };
      acc.thursday += sale.thursday || 0;
      acc.friday += sale.friday || 0;
      acc.saturday += sale.saturday || 0;
      return acc;
    }, { thursday: 0, friday: 0, saturday: 0 });

    const count = weeksValue.length;
    return {
      thursday: Math.round(totals.thursday / count),
      friday: Math.round(totals.friday / count),
      saturday: Math.round(totals.saturday / count),
    };
  });

  sortedWeeks = computed(() => {
    const weeksValue = this.weeks();
    if (!weeksValue || weeksValue.length === 0) return [];
    return [...weeksValue].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.weekNumber - a.weekNumber;
    });
  });

  revenueChange = computed(() => {
    const summaryValue = this.summary();
    const weeksValue = this.weeks();
    if (!summaryValue || !weeksValue || weeksValue.length < 2) return null;
    const sortedWeeks = this.sortedWeeks();
    const currentWeek = sortedWeeks[0];
    const previousWeek = sortedWeeks[1];
    const currentRevenue = currentWeek.revenue || 0;
    const previousRevenue = previousWeek.revenue || 0;
    return this.calculatePercentageChange(currentRevenue, previousRevenue);
  });

  profitChange = computed(() => {
    const summaryValue = this.summary();
    const weeksValue = this.weeks();
    if (!summaryValue || !weeksValue || weeksValue.length < 2) return null;
    const sortedWeeks = this.sortedWeeks();
    const currentWeek = sortedWeeks[0];
    const previousWeek = sortedWeeks[1];
    const currentProfit = currentWeek.profit || 0;
    const previousProfit = previousWeek.profit || 0;
    return this.calculatePercentageChange(currentProfit, previousProfit);
  });

  savingsChange = computed(() => {
    const summaryValue = this.summary();
    const weeksValue = this.weeks();
    if (!summaryValue || !weeksValue || weeksValue.length < 2) return null;
    const sortedWeeks = this.sortedWeeks();
    const currentWeek = sortedWeeks[0];
    const previousWeek = sortedWeeks[1];
    const currentSavings = currentWeek.savings || 0;
    const previousSavings = previousWeek.savings || 0;
    return this.calculatePercentageChange(currentSavings, previousSavings);
  });

  averageRevenueChange = computed(() => {
    const summaryValue = this.summary();
    const weeksValue = this.weeks();
    if (!summaryValue || !weeksValue || weeksValue.length < 8) return null;
    const sortedWeeks = this.sortedWeeks();
    const last4Weeks = sortedWeeks.slice(0, 4);
    const previous4Weeks = sortedWeeks.slice(4, 8);
    
    if (previous4Weeks.length === 0) return null;
    
    const currentAvg = last4Weeks.reduce((sum, w) => sum + (w.revenue || 0), 0) / last4Weeks.length;
    const previousAvg = previous4Weeks.reduce((sum, w) => sum + (w.revenue || 0), 0) / previous4Weeks.length;
    return this.calculatePercentageChange(currentAvg, previousAvg);
  });

  flowersChange = computed(() => {
    const summaryValue = this.summary();
    const weeksValue = this.weeks();
    if (!summaryValue || !weeksValue || weeksValue.length < 2) return null;
    const sortedWeeks = this.sortedWeeks();
    const currentWeek = sortedWeeks[0];
    const previousWeek = sortedWeeks[1];
    const currentFlowers = currentWeek.totalFlower || 0;
    const previousFlowers = previousWeek.totalFlower || 0;
    return this.calculatePercentageChange(currentFlowers, previousFlowers);
  });

  investmentChange = computed(() => {
    const summaryValue = this.summary();
    const weeksValue = this.weeks();
    if (!summaryValue || !weeksValue || weeksValue.length < 2) return null;
    const sortedWeeks = this.sortedWeeks();
    const currentWeek = sortedWeeks[0];
    const previousWeek = sortedWeeks[1];
    const currentInvestment = currentWeek.totalBuyingPrice || 0;
    const previousInvestment = previousWeek.totalBuyingPrice || 0;
    return this.calculatePercentageChange(currentInvestment, previousInvestment);
  });

  availableSavings = computed(() => {
    const summaryValue = this.summary();
    const withdrawalSummaryValue = this.withdrawalSummary();
    if (!summaryValue) return 0;
    if (!withdrawalSummaryValue) return summaryValue.totalSavings;
    return withdrawalSummaryValue.availableSavings;
  });

  // Methods
  onDeleteWeek(id: string): void {
    this.deleteWeek.emit(id);
  }

  onTabClick(tab: 'weekly' | 'trends'): void {
    this.setActiveTab.emit(tab);
  }

  onEditWeek(week: IWeek): void {
    this.selectedWeekForEdit.set(week);
  }

  onWeekAdded(): void {
    this.selectedWeekForEdit.set(null);
    this.weekAdded.emit();
  }

  onWeekUpdated(): void {
    this.selectedWeekForEdit.set(null);
    this.weekUpdated.emit();
  }

  onEditCancelled(): void {
    this.selectedWeekForEdit.set(null);
    this.editCancelled.emit();
  }

  private calculatePercentageChange(current: number, previous: number): number | null {
    if (!previous || previous === 0) return null;
    return ((current - previous) / previous) * 100;
  }

  formatPercentageChange(change: number | null): string {
    if (change === null) return 'New';
    if (change === 0) return '0%';
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  }

  getChangeClass(change: number | null): string {
    if (change === null) return '';
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return '';
  }

  hasChangeData(change: number | null): boolean {
    return change !== null;
  }
}
