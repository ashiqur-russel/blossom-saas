import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
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
import { catchError, finalize } from 'rxjs/operators';
import { of, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardPresentationComponent],
  templateUrl: './dashboard.container.html',
  styleUrl: './dashboard.container.scss',
})
export class DashboardContainerComponent implements OnInit, OnDestroy {
  private refreshTrigger = new Subject<void>();
  private subscription?: Subscription;
  activeTab = signal<'weekly' | 'trends'>('weekly');

  loading = signal(true);
  error = signal<string | null>(null);
  
  dashboardData = signal<{ weeks: IWeek[]; summary: IWeekSummary | null; withdrawalSummary: IWithdrawalSummary | null }>({
    weeks: [],
    summary: null,
    withdrawalSummary: null
  });

  weeks = computed(() => this.dashboardData().weeks);
  summary = computed(() => this.dashboardData().summary);
  withdrawalSummary = computed(() => this.dashboardData().withdrawalSummary);

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
  ) {}

  ngOnInit(): void {
    // Set up subscription to refresh trigger
    this.subscription = this.refreshTrigger.subscribe(() => {
      this.loadData();
    });
    
    // Trigger initial load
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private loadData(forceRefresh: boolean = false): void {
    if (!this.dashboardService) {
      console.error('DashboardService is not initialized');
      this.loading.set(false);
      this.error.set('Service initialization error');
      return;
    }
    
    // Only show loading if we don't have cached data
    const hasCachedData = this.dashboardData().weeks.length > 0 || this.dashboardData().summary !== null;
    if (!hasCachedData || forceRefresh) {
      this.loading.set(true);
    }
    this.error.set(null);
    
    this.dashboardService.loadDashboardData(forceRefresh).subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.loading.set(false);
        const errorMsg = extractErrorMessage(err, 'Failed to load dashboard data');
        if (err?.isCritical !== false && !errorMsg.toLowerCase().includes('withdrawal')) {
          this.error.set(errorMsg);
          console.error('Dashboard load error:', err);
        }
        // Set empty data on error only if we don't have cached data
        if (!hasCachedData) {
          this.dashboardData.set({ weeks: [], summary: null, withdrawalSummary: null });
        }
      }
    });
  }

  setActiveTab(tab: 'weekly' | 'trends'): void {
    this.activeTab.set(tab);
  }

  deleteWeek(id: string): void {
    if (confirm('Are you sure you want to delete this week?')) {
      this.refreshing.set(true);
      this.weekService.delete(id).subscribe({
        next: () => {
          // Invalidate cache and refresh
          this.dashboardService.invalidateCache();
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
    // Invalidate cache and refresh
    this.dashboardService.invalidateCache();
    this.refreshData();
  }

  onWeekUpdated(): void {
    // Invalidate cache and refresh
    this.dashboardService.invalidateCache();
    this.refreshData();
  }

  refreshData(): void {
    // Force refresh and invalidate cache
    this.dashboardService.invalidateCache();
    this.refreshing.set(true);
    this.loadData(true); // Force refresh
    
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


