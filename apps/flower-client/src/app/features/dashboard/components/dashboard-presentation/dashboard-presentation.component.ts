import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { IWeek, IWeekSummary } from '../../../../shared/models/week.model';
import { IWithdrawalSummary } from '../../../withdrawals/services/withdrawal.service';
import { CardComponent } from '../../../../shared/ui/components/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/components/button/button.component';
import { ChartComponent } from '../../../../shared/ui/components/chart/chart.component';
import { ChartService } from '../../../../shared/ui/services/chart.service';
import { WeekCardComponent } from '../../../weeks/components/week-card/week-card.component';
import { SalesFormComponent } from '../sales-form/sales-form.component';

@Component({
  selector: 'app-dashboard-presentation',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, ChartComponent, DatePipe, SalesFormComponent],
  templateUrl: './dashboard-presentation.component.html',
  styleUrl: './dashboard-presentation.component.scss',
})
export class DashboardPresentationComponent {
  @Input() weeks: IWeek[] = [];
  @Input() summary: IWeekSummary | null = null;
  @Input() withdrawalSummary: IWithdrawalSummary | null = null;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() profitChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  @Input() salesChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  @Input() revenueProfitTrendsData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  @Input() profitSavingsBarData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  @Input() salesByDayPieData: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
  @Input() dailySalesTrendsData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  @Input() currentWeek: IWeek | null = null;
  @Input() activeTab: 'weekly' | 'trends' = 'weekly';
  @Input() getProfitColor!: (profit: number) => string;
  @Input() getProfitBgColor!: (profit: number) => string;
  @Output() deleteWeek = new EventEmitter<string>();
  @Output() setActiveTab = new EventEmitter<'weekly' | 'trends'>();
  @Output() weekAdded = new EventEmitter<void>();
  @Output() weekUpdated = new EventEmitter<void>();
  @Output() editCancelled = new EventEmitter<void>();

  selectedWeekForEdit: IWeek | null = null;

  chartService = new ChartService();

  getAverageSalesByDay(): { thursday: number; friday: number; saturday: number } {
    if (!this.weeks || this.weeks.length === 0) {
      return { thursday: 0, friday: 0, saturday: 0 };
    }

    const totals = this.weeks.reduce((acc, week) => {
      const sale = week.sale || { thursday: 0, friday: 0, saturday: 0 };
      acc.thursday += sale.thursday || 0;
      acc.friday += sale.friday || 0;
      acc.saturday += sale.saturday || 0;
      return acc;
    }, { thursday: 0, friday: 0, saturday: 0 });

    const count = this.weeks.length;
    return {
      thursday: Math.round(totals.thursday / count),
      friday: Math.round(totals.friday / count),
      saturday: Math.round(totals.saturday / count),
    };
  }

  onDeleteWeek(id: string): void {
    this.deleteWeek.emit(id);
  }

  onTabClick(tab: 'weekly' | 'trends'): void {
    this.setActiveTab.emit(tab);
  }

  onEditWeek(week: IWeek): void {
    this.selectedWeekForEdit = week;
  }

  onWeekAdded(): void {
    this.selectedWeekForEdit = null;
    this.weekAdded.emit();
  }

  onWeekUpdated(): void {
    this.selectedWeekForEdit = null;
    this.weekUpdated.emit();
  }

  onEditCancelled(): void {
    this.selectedWeekForEdit = null;
    this.editCancelled.emit();
  }

  calculatePercentageChange(current: number, previous: number): number | null {
    if (!previous || previous === 0) return null;
    return ((current - previous) / previous) * 100;
  }

  getSortedWeeks(): IWeek[] {
    if (!this.weeks || this.weeks.length === 0) return [];
    return [...this.weeks].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.weekNumber - a.weekNumber;
    });
  }

  getRevenueChange(): number | null {
    if (!this.summary || !this.weeks || this.weeks.length < 2) return null;
    const sortedWeeks = this.getSortedWeeks();
    const currentWeek = sortedWeeks[0];
    const previousWeek = sortedWeeks[1];
    const currentRevenue = currentWeek.revenue || 0;
    const previousRevenue = previousWeek.revenue || 0;
    return this.calculatePercentageChange(currentRevenue, previousRevenue);
  }

  getProfitChange(): number | null {
    if (!this.summary || !this.weeks || this.weeks.length < 2) return null;
    const sortedWeeks = this.getSortedWeeks();
    const currentWeek = sortedWeeks[0];
    const previousWeek = sortedWeeks[1];
    const currentProfit = currentWeek.profit || 0;
    const previousProfit = previousWeek.profit || 0;
    return this.calculatePercentageChange(currentProfit, previousProfit);
  }

  getSavingsChange(): number | null {
    if (!this.summary || !this.weeks || this.weeks.length < 2) return null;
    const sortedWeeks = this.getSortedWeeks();
    const currentWeek = sortedWeeks[0];
    const previousWeek = sortedWeeks[1];
    const currentSavings = currentWeek.savings || 0;
    const previousSavings = previousWeek.savings || 0;
    return this.calculatePercentageChange(currentSavings, previousSavings);
  }

  getAverageRevenueChange(): number | null {
    if (!this.summary || !this.weeks || this.weeks.length < 8) return null;
    const sortedWeeks = this.getSortedWeeks();
    const last4Weeks = sortedWeeks.slice(0, 4);
    const previous4Weeks = sortedWeeks.slice(4, 8);
    
    if (previous4Weeks.length === 0) return null;
    
    const currentAvg = last4Weeks.reduce((sum, w) => sum + (w.revenue || 0), 0) / last4Weeks.length;
    const previousAvg = previous4Weeks.reduce((sum, w) => sum + (w.revenue || 0), 0) / previous4Weeks.length;
    return this.calculatePercentageChange(currentAvg, previousAvg);
  }

  getFlowersChange(): number | null {
    if (!this.summary || !this.weeks || this.weeks.length < 2) return null;
    const sortedWeeks = this.getSortedWeeks();
    const currentWeek = sortedWeeks[0];
    const previousWeek = sortedWeeks[1];
    const currentFlowers = currentWeek.totalFlower || 0;
    const previousFlowers = previousWeek.totalFlower || 0;
    return this.calculatePercentageChange(currentFlowers, previousFlowers);
  }

  getInvestmentChange(): number | null {
    if (!this.summary || !this.weeks || this.weeks.length < 2) return null;
    const sortedWeeks = this.getSortedWeeks();
    const currentWeek = sortedWeeks[0];
    const previousWeek = sortedWeeks[1];
    const currentInvestment = currentWeek.totalBuyingPrice || 0;
    const previousInvestment = previousWeek.totalBuyingPrice || 0;
    return this.calculatePercentageChange(currentInvestment, previousInvestment);
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

  getAvailableSavings(): number {
    if (!this.summary) return 0;
    if (!this.withdrawalSummary) return this.summary.totalSavings;
    return this.withdrawalSummary.availableSavings;
  }
}
