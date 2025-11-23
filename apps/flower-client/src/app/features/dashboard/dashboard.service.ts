import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WeekService, SummaryService } from '../weeks';
import { WithdrawalService } from '../withdrawals';
import { IWeek, IWeekSummary } from '../../shared/models/week.model';
import { IWithdrawalSummary } from '../../shared/models/withdrawal.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private weekService: WeekService,
    private summaryService: SummaryService,
    private withdrawalService: WithdrawalService,
  ) {}

  loadDashboardData(): Observable<{ weeks: IWeek[]; summary: IWeekSummary; withdrawalSummary: IWithdrawalSummary | null }> {
    return forkJoin({
      weeks: this.weekService.getAll(),
      summary: this.summaryService.getSummary(),
      withdrawalSummary: this.withdrawalService.getSummary().pipe(
        catchError((error) => {
          // Silently handle withdrawal summary errors (it's optional)
          // Withdrawal summary is not critical - dashboard can work without it
          // No logging - completely silent failure
          return of(null);
        })
      ),
    }).pipe(
      catchError((error) => {
        // If forkJoin fails, it means weeks or summary failed (critical)
        // Re-throw with a more specific error message
        throw {
          ...error,
          isCritical: true,
          message: error?.message || 'Failed to load dashboard data'
        };
      })
    );
  }
}

