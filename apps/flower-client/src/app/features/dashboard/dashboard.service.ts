import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, shareReplay, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IWeek, IWeekSummary } from '../../shared/models/week.model';
import { IWithdrawalSummary } from '../../shared/models/withdrawal.model';
import { WeekService } from '../weeks';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/flower-weeks`;
  private cacheKey = 'dashboard_data';
  private cache$: Observable<{ weeks: IWeek[]; summary: IWeekSummary; withdrawalSummary: IWithdrawalSummary | null }> | null = null;
  private cachedData: { weeks: IWeek[]; summary: IWeekSummary; withdrawalSummary: IWithdrawalSummary | null } | null = null;
  private readonly CACHE_TTL = 2 * 60 * 1000; // 2 minutes cache
  private cacheTimestamp = 0;

  constructor(
    private http: HttpClient,
    private weekService: WeekService,
  ) {}

  loadDashboardData(forceRefresh: boolean = false): Observable<{ weeks: IWeek[]; summary: IWeekSummary; withdrawalSummary: IWithdrawalSummary | null }> {
    // Return cached data if available and not expired
    if (!forceRefresh && this.cachedData && (Date.now() - this.cacheTimestamp) < this.CACHE_TTL) {
      return of(this.cachedData);
    }

    // Return shared observable if already in progress
    if (this.cache$ && !forceRefresh) {
      return this.cache$;
    }

    // Create new request with caching
    this.cache$ = this.http.get<any>(`${this.apiUrl}/dashboard`).pipe(
      map((response) => {
        const data = {
          weeks: response.weeks.map((week: any) => (this.weekService as any).normalizeEntity(week)),
          summary: this.normalizeSummary(response.summary),
          withdrawalSummary: response.withdrawalSummary ? this.normalizeWithdrawalSummary(response.withdrawalSummary) : null,
        };
        // Cache the data
        this.cachedData = data;
        this.cacheTimestamp = Date.now();
        return data;
      }),
      shareReplay(1),
      tap({
        finalize: () => {
          // Clear cache$ after completion so next request creates a new one
          setTimeout(() => {
            this.cache$ = null;
          }, 100);
        }
      }),
      catchError((error) => {
        this.cache$ = null;
        throw error;
      })
    );

    return this.cache$;
  }

  /**
   * Invalidate dashboard cache (call after mutations)
   */
  invalidateCache(): void {
    this.cachedData = null;
    this.cache$ = null;
    this.cacheTimestamp = 0;
  }

  private normalizeSummary(summary: any): IWeekSummary {
    return {
      totalWeeks: summary.totalWeeks || 0,
      totalFlowers: summary.totalFlowers || 0,
      totalBuyingPrice: summary.totalBuyingPrice || 0,
      totalSales: summary.totalSales || 0,
      totalProfit: summary.totalProfit || 0,
      totalRevenue: summary.totalRevenue || 0,
      totalSavings: summary.totalSavings || 0,
      averageProfit: summary.averageProfit || 0,
      averageRevenue: summary.averageRevenue || 0,
      averageFlowers: summary.averageFlowers || 0,
      bestWeek: summary.bestWeek || null,
    };
  }

  private normalizeWithdrawalSummary(summary: any): IWithdrawalSummary {
    return {
      totalWithdrawals: summary.totalWithdrawals || 0,
      totalSavings: summary.totalSavings || 0,
      availableSavings: summary.availableSavings || 0,
      totalWithdrawalCount: summary.totalWithdrawalCount || 0,
    };
  }
}

