import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IWeek, IWeekSummary } from '../../shared/models/week.model';
import { IWithdrawalSummary } from '../../shared/models/withdrawal.model';
import { WeekService } from '../weeks';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/flower-weeks`;

  constructor(
    private http: HttpClient,
    private weekService: WeekService,
  ) {}

  loadDashboardData(): Observable<{ weeks: IWeek[]; summary: IWeekSummary; withdrawalSummary: IWithdrawalSummary | null }> {
    // Use optimized single endpoint instead of 3 separate requests
    // This reduces from 3 HTTP requests to 1, and from 3+ DB queries to 2
    return this.http.get<any>(`${this.apiUrl}/dashboard`).pipe(
      map((response) => ({
        weeks: response.weeks.map((week: any) => (this.weekService as any).normalizeEntity(week)),
        summary: this.normalizeSummary(response.summary),
        withdrawalSummary: response.withdrawalSummary ? this.normalizeWithdrawalSummary(response.withdrawalSummary) : null,
      }))
    );
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

