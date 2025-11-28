import { Component, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { ChartService } from '../../shared/ui/services/chart.service';
import { WeekService } from '../weeks';
import { IWeek, IWeekSummary } from '../../shared/models/week.model';
import { IWithdrawalSummary } from '../../shared/models/withdrawal.model';
import { ChartConfiguration } from 'chart.js';
import { DashboardPresentationComponent } from './dashboard.presentation';
import { extractErrorMessage } from '../../shared/utils/error.util';
import { catchError, map, startWith } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardPresentationComponent],
  templateUrl: './dashboard.container.html',
  styleUrl: './dashboard.container.scss',
})
export class DashboardContainerComponent {
  private refreshTrigger = signal(0);
  activeTab = signal<'weekly' | 'trends'>('weekly');

  // Use toSignal for reactive data fetching
  private dashboardData$ = computed(() => {
    this.refreshTrigger(); // Track refresh trigger
    return this.dashboardService.loadDashboardData().pipe(
      catchError((err: any) => {
        const errorMsg = extractErrorMessage(err, 'Failed to load dashboard data');
        if (err?.isCritical !== false && !errorMsg.toLowerCase().includes('withdrawal')) {
          throw { ...err, message: errorMsg };
        }
        return of({ weeks: [], summary: null, withdrawalSummary: null });
      })
    );
  });

  dashboardData = toSignal(this.dashboardData$(), { 
    initialValue: { weeks: [], summary: null, withdrawalSummary: null } 
  });

  loading = signal(false);
  error = signal<string | null>(null);

  weeks = computed(() => this.dashboardData()?.weeks || []);
  summary = computed(() => this.dashboardData()?.summary || null);
  withdrawalSummary = computed(() => this.dashboardData()?.withdrawalSummary || null);

  profitChartData = computed<ChartConfiguration<'line'>['data']>(() => 
    this.chartService.createProfitChartData(this.weeks())
  );
  salesChartData = computed<ChartConfiguration<'bar'>['data']>(() => 
    this.chartService.getSalesChartData(this.weeks())
  );
  revenueProfitTrendsData = computed<ChartConfiguration<'line'>['data']>(() => 
    this.chartService.createRevenueProfitTrendsData(this.weeks())
  );
  profitSavingsBarData = computed<ChartConfiguration<'bar'>['data']>(() => 
    this.chartService.createProfitSavingsBarData(this.weeks())
  );
  dailySalesTrendsData = computed<ChartConfiguration<'line'>['data']>(() => 
    this.chartService.createDailySalesTrendsData(this.weeks())
  );
  
  currentWeek = computed<IWeek | null>(() => {
    const sortedWeeks = [...this.weeks()].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.weekNumber - a.weekNumber;
    });
    return sortedWeeks.length > 0 ? sortedWeeks[0] : null;
  });

  salesByDayPieData = computed<ChartConfiguration<'pie'>['data']>(() => 
    this.chartService.createSalesByDayPieData(this.currentWeek())
  );

  refreshing = signal(false);

  constructor(
    private dashboardService: DashboardService,
    private chartService: ChartService,
    private weekService: WeekService,
  ) {
    // Trigger initial load
    this.refreshTrigger.set(1);
  }

  setActiveTab(tab: 'weekly' | 'trends'): void {
    this.activeTab.set(tab);
  }

  deleteWeek(id: string): void {
    if (confirm('Are you sure you want to delete this week?')) {
      this.refreshing.set(true);
      this.weekService.delete(id).subscribe({
        next: () => {
          this.refreshData();
        },
        error: (err: any) => {
          this.refreshing.set(false);
          console.error(err);
        },
      });
    }
  }

  onWeekAdded(): void {
    this.refreshData();
  }

  onWeekUpdated(): void {
    this.refreshData();
  }

  refreshData(): void {
    // Only refresh data without showing full-page loading
    this.refreshing.set(true);
    this.refreshTrigger.update((v: number) => v + 1);
    
    // Reset refreshing after data loads - check loading state periodically
    const checkLoading = setInterval(() => {
      if (!this.loading()) {
        this.refreshing.set(false);
        clearInterval(checkLoading);
      }
    }, 50);
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

